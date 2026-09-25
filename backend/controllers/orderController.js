import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// Create a new order (Buyer checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address (name, phone, address, city) is required',
      });
    }

    // Format and sanitize order items
    const sanitizedItems = items.map((item) => ({
      bookId: item.bookId || item._id || item.id,
      price: Number(item.price || item.sellingPrice || 0),
    }));

    // Verify valid book IDs
    for (const item of sanitizedItems) {
      if (!mongoose.Types.ObjectId.isValid(item.bookId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid book ID: ${item.bookId}`,
        });
      }
    }

    const newOrder = await Order.create({
      buyerId: req.user._id,
      items: sanitizedItems,
      totalAmount: Number(totalAmount),
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
      },
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    const populatedOrder = await Order.findById(newOrder._id).populate({
      path: 'items.bookId',
      select: 'title author originalPrice sellingPrice images condition category',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// Get all orders for the authenticated buyer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate({
        path: 'items.bookId',
        select: 'title author originalPrice sellingPrice images condition category',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
};

// Cancel an order (Buyer action: only allowed if order is still 'pending')
export const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const order = await Order.findOne({ _id: id, buyerId: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied',
      });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}.`,
      });
    }

    // Update status
    order.orderStatus = 'cancelled';
    order.paymentStatus = 'failed';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

// Get all orders across platform (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('buyerId', 'name email address')
      .populate({
        path: 'items.bookId',
        select: 'title author originalPrice sellingPrice images condition category',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve all orders',
      error: error.message,
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after' }
    )
      .populate('buyerId', 'name email address')
      .populate({
        path: 'items.bookId',
        select: 'title author originalPrice sellingPrice images condition category',
      });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus || updatedOrder.orderStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

