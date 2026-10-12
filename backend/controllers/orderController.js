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

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
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

    // Verify valid book IDs format
    for (const item of sanitizedItems) {
      if (!mongoose.Types.ObjectId.isValid(item.bookId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid book ID: ${item.bookId}`,
        });
      }
    }

    const bookIds = sanitizedItems.map((item) => item.bookId);

    // Verify all books exist and are currently active ('approved')
    const existingBooks = await Book.find({ _id: { $in: bookIds } });
    if (existingBooks.length !== bookIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more books in your cart could not be found.',
      });
    }

    // Check if any book is already sold or not approved
    const unavailableBook = existingBooks.find((book) => book.status !== 'approved');
    if (unavailableBook) {
      return res.status(400).json({
        success: false,
        message: `The book "${unavailableBook.title}" is no longer available (already sold or unlisted).`,
      });
    }

    // Normalize payment method
    const validPaymentMethods = ['COD', 'eSewa', 'Khalti', 'Bank Transfer'];
    const chosenPaymentMethod = validPaymentMethods.includes(paymentMethod)
      ? paymentMethod
      : 'COD';

    // Create the order
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
      paymentMethod: chosenPaymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    // Mark purchased books as 'sold' so they cannot be purchased again
    await Book.updateMany(
      { _id: { $in: bookIds } },
      { $set: { status: 'sold' } }
    );

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
    console.error('Create order error:', error);
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

    // Restock books back to 'approved' so they appear in catalog again
    const bookIds = order.items.map((item) => item.bookId);
    await Book.updateMany(
      { _id: { $in: bookIds }, status: 'sold' },
      { $set: { status: 'approved' } }
    );

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and books returned to inventory',
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
        select: 'title author originalPrice sellingPrice images condition category sellerId',
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

    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    } else if (orderStatus === 'delivered' && currentOrder.paymentStatus === 'pending') {
      // For COD, when delivered, payment is completed
      updateFields.paymentStatus = 'completed';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after' }
    )
      .populate('buyerId', 'name email address')
      .populate({
        path: 'items.bookId',
        select: 'title author originalPrice sellingPrice images condition category sellerId',
      });

    // Handle book stock adjustments based on status transitions
    const bookIds = updatedOrder.items.map((item) =>
      item.bookId?._id ? item.bookId._id : item.bookId
    );

    if (orderStatus === 'cancelled') {
      // Re-list books if order was cancelled
      await Book.updateMany(
        { _id: { $in: bookIds }, status: 'sold' },
        { $set: { status: 'approved' } }
      );
    } else if (currentOrder.orderStatus === 'cancelled' && orderStatus !== 'cancelled') {
      // Re-mark books as sold if reactivated
      await Book.updateMany(
        { _id: { $in: bookIds } },
        { $set: { status: 'sold' } }
      );
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
