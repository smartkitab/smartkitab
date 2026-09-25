import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET || 'smartkitab_jwt_secret_key_2026';
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: '7d' });
};

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

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'buyer',
      address: address || {},
      isBookCycleSubscriber: Boolean(isBookCycleSubscriber),
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isBookCycleSubscriber: newUser.isBookCycleSubscriber,
        address: newUser.address,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBookCycleSubscriber: user.isBookCycleSubscriber,
        address: user.address,
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


