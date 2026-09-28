import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET || 'smartkitab_jwt_secret_key_2026';
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: '7d' });
};

/**
 * Register a new user with email verification
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, address, isBookCycleSubscriber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with unverified state
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'buyer',
      address: address || {},
      isBookCycleSubscriber: Boolean(isBookCycleSubscriber),
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      authProvider: 'local',
    });

    // Send verification email via Gmail / SMTP
    const emailResult = await sendVerificationEmail({
      to: newUser.email,
      name: newUser.name,
      verificationToken,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Account created! An activation link has been sent to your Gmail/email. Please click the link to activate your account.',
      email: newUser.email,
      verificationUrl: emailResult.simulated ? emailResult.verificationUrl : undefined,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

/**
 * Verify email address using token
 */
export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link. Please request a new one.',
      });
    }

    // Mark as verified and clear token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    const authToken = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
      token: authToken,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBookCycleSubscriber: user.isBookCycleSubscriber,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account is already verified. You can log in directly.',
      });
    }

    // Generate new token & expiry
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const emailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationToken,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: 'A fresh activation link has been sent to your Gmail/email.',
      verificationUrl: emailResult.simulated ? emailResult.verificationUrl : undefined,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
};

/**
 * Log in existing user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password if account is password-based
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    } else if (user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please click "Sign in with Google".',
      });
    }

    // Check email verification status (admins and superadmins bypass verification)
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    if (!user.isVerified && !isAdmin) {
      return res.status(403).json({
        success: false,
        isUnverified: true,
        email: user.email,
        message: 'Your account is not verified yet. Please check your Gmail or click below to resend the activation link.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBookCycleSubscriber: user.isBookCycleSubscriber,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to log in',
      error: error.message,
    });
  }
};

/**
 * Google OAuth Direct Sign-In / Registration
 */
export const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    let payload;

    // Verify token using google-auth-library if CLIENT_ID is present, else decode/verify via Google tokeninfo
    try {
      if (process.env.GOOGLE_CLIENT_ID) {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } else {
        // Fallback: verify via Google tokeninfo endpoint
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!response.ok) {
          throw new Error('Google token verification failed');
        }
        payload = await response.json();
      }
    } catch (err) {
      console.error('Google token verification error:', err);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google authentication token',
      });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'Could not retrieve email from Google profile',
      });
    }

    const { email, name, picture, sub: googleId } = payload;
    const lowerEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: lowerEmail });

    if (user) {
      // User already exists: update verified state and googleId if needed
      user.isVerified = true;
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    } else {
      // Create new verified user via Google
      user = await User.create({
        name: name || 'Google User',
        email: lowerEmail,
        role: role === 'seller' ? 'seller' : 'buyer',
        authProvider: 'google',
        googleId,
        avatar: picture || '',
        isVerified: true,
        address: {},
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Signed in with Google successfully!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBookCycleSubscriber: user.isBookCycleSubscriber,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google',
      error: error.message,
    });
  }
};

/**
 * Fetch authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

/**
 * Update authenticated user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, address, payoutInfo, isBookCycleSubscriber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (address) {
      user.address = {
        street: address.street !== undefined ? address.street : user.address?.street || '',
        city: address.city !== undefined ? address.city : user.address?.city || '',
        phone: address.phone !== undefined ? address.phone : user.address?.phone || '',
      };
    }

    if (payoutInfo) {
      user.payoutInfo = {
        method: payoutInfo.method || user.payoutInfo?.method || 'eSewa',
        accountNumber: payoutInfo.accountNumber !== undefined ? payoutInfo.accountNumber : user.payoutInfo?.accountNumber || '',
        accountName: payoutInfo.accountName !== undefined ? payoutInfo.accountName : user.payoutInfo?.accountName || '',
        bankName: payoutInfo.bankName !== undefined ? payoutInfo.bankName : user.payoutInfo?.bankName || '',
      };
    }

    if (isBookCycleSubscriber !== undefined) {
      user.isBookCycleSubscriber = Boolean(isBookCycleSubscriber);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBookCycleSubscriber: user.isBookCycleSubscriber,
        address: user.address,
        payoutInfo: user.payoutInfo,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
