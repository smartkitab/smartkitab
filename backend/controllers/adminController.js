import bcrypt from 'bcryptjs';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const getPendingBooks = async (req, res) => {
  try {
    const pendingBooks = await Book.find({ status: 'pending' })
      .populate('sellerId', 'name email address')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pendingBooks.length,
      books: pendingBooks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending books',
      error: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalBooks, pendingApprovals, salesAggregation] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Book.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalSales = salesAggregation.length > 0 ? salesAggregation[0].total : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBooks,
        totalSales,
        pendingApprovals,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin statistics',
      error: error.message,
    });
  }
};

// ================= STAFF & ROLE-BASED ACCESS CONTROL =================

export const getStaffUsers = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'superadmin'] } })
      .select('-password')
      .sort({ role: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch administrative staff',
      error: error.message,
    });
  }
};

export const createStaffUser = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'superadmin' ? 'superadmin' : 'admin',
      permissions: {
        canManageBooks: permissions?.canManageBooks ?? true,
        canManageOrders: permissions?.canManageOrders ?? true,
        canManageCMS: permissions?.canManageCMS ?? true,
        canManageCurations: permissions?.canManageCurations ?? true,
        canManageUsers: permissions?.canManageUsers ?? false,
        canManageAdmins: permissions?.canManageAdmins ?? false,
      },
    });

    return res.status(201).json({
      success: true,
      message: `Admin account created successfully for ${newStaff.name}`,
      staff: {
        _id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        permissions: newStaff.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create admin staff account',
      error: error.message,
    });
  }
};

export const updateStaffPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Staff user not found',
      });
    }

    // Protect superadmin account from being demoted accidentally by others
    if (targetUser.role === 'superadmin' && req.user._id.toString() !== targetUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Superadmin accounts cannot be modified by other admins',
      });
    }

    if (role && ['admin', 'superadmin'].includes(role)) {
      targetUser.role = role;
    }

    if (permissions) {
      targetUser.permissions = {
        canManageBooks: permissions.canManageBooks ?? targetUser.permissions.canManageBooks,
        canManageOrders: permissions.canManageOrders ?? targetUser.permissions.canManageOrders,
        canManageCMS: permissions.canManageCMS ?? targetUser.permissions.canManageCMS,
        canManageCurations: permissions.canManageCurations ?? targetUser.permissions.canManageCurations,
        canManageUsers: permissions.canManageUsers ?? targetUser.permissions.canManageUsers,
        canManageAdmins: permissions.canManageAdmins ?? targetUser.permissions.canManageAdmins,
      };
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Updated permissions for ${targetUser.name}`,
      staff: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        permissions: targetUser.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update staff permissions',
      error: error.message,
    });
  }
};

export const deleteStaffUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own administrative account',
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Staff user not found',
      });
    }

    if (targetUser.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Superadmin accounts cannot be deleted',
      });
    }

    // Demote to regular buyer rather than hard deleting order history
    targetUser.role = 'buyer';
    targetUser.permissions = {};
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Administrative access revoked for ${targetUser.name}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke staff access',
      error: error.message,
    });
  }
};

// ================= CURATIONS (FEATURED & BESTSELLERS) =================

export const getCurations = async (req, res) => {
  try {
    const books = await Book.find({ status: 'approved' })
      .select('title author category sellingPrice originalPrice images isFeatured featuredOrder isBestSeller bestSellerOrder condition')
      .sort({ isFeatured: -1, featuredOrder: 1, isBestSeller: -1, bestSellerOrder: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch book curations',
      error: error.message,
    });
  }
};

export const updateBookCuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured, featuredOrder, isBestSeller, bestSellerOrder } = req.body;

    const updateFields = {};
    if (isFeatured !== undefined) updateFields.isFeatured = Boolean(isFeatured);
    if (featuredOrder !== undefined) updateFields.featuredOrder = Number(featuredOrder);
    if (isBestSeller !== undefined) updateFields.isBestSeller = Boolean(isBestSeller);
    if (bestSellerOrder !== undefined) updateFields.bestSellerOrder = Number(bestSellerOrder);

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Curation updated for "${updatedBook.title}"`,
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update book curation',
      error: error.message,
    });
  }
};

