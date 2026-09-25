import mongoose from 'mongoose';
import Book from '../models/Book.js';

export const getAllBooks = async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      keyword,
      type,
      featured,
      bestseller,
    } = req.query;

    const query = {
      status: 'approved',
    };

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Best Seller filter
    if (bestseller === 'true') {
      query.isBestSeller = true;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Listing type filter (sale / donation)
    if (type) {
      query.type = type;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.sellingPrice = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.sellingPrice.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.sellingPrice.$lte = Number(maxPrice);
      }
    }

    // Search keyword on title or author
    const searchTerm = search || keyword;
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Dynamic sort priority: rank ordering for featured and bestsellers
    let sortOption = { createdAt: -1 };
    if (featured === 'true') {
      sortOption = { featuredOrder: 1, createdAt: -1 };
    } else if (bestseller === 'true') {
      sortOption = { bestSellerOrder: 1, createdAt: -1 };
    }

    const books = await Book.find(query)
      .populate('sellerId', 'name email address')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const book = await Book.findById(id).populate('sellerId', 'name email address');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve book details',
      error: error.message,
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      originalPrice,
      sellingPrice,
      condition,
      images,
      type,
    } = req.body;

    const parsedOriginalPrice = Number(originalPrice);
    const parsedSellingPrice = Number(sellingPrice);

    const newBook = await Book.create({
      title,
      author,
      category,
      originalPrice: parsedOriginalPrice,
      sellingPrice: parsedSellingPrice,
      sellerAskingPrice: parsedSellingPrice, // Preserve original seller submitted price
      condition,
      images,
      sellerId: req.user._id,
      status: 'pending', // Always default to pending for review
      type: type || 'sale',
    });

    return res.status(201).json({
      success: true,
      message: 'Book listing submitted successfully and is pending approval',
      book: newBook,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create book listing',
      error: error.message,
    });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sellingPrice, originalPrice, condition, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const updateFields = {};
    if (status) {
      const allowedStatuses = ['approved', 'rejected', 'pending', 'sold'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${allowedStatuses.join(', ')}`,
        });
      }
      updateFields.status = status;
    }

    if (sellingPrice !== undefined && !isNaN(Number(sellingPrice))) {
      updateFields.sellingPrice = Number(sellingPrice);
    }
    if (originalPrice !== undefined && !isNaN(Number(originalPrice))) {
      updateFields.originalPrice = Number(originalPrice);
    }
    if (condition) updateFields.condition = condition;
    if (category) updateFields.category = category;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    ).populate('sellerId', 'name email address');

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: status ? `Book status updated to ${status}` : 'Book details updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update book status',
      error: error.message,
    });
  }
};

export const updateBookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, originalPrice, sellingPrice, condition, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (author) updateFields.author = author;
    if (category) updateFields.category = category;
    if (condition) updateFields.condition = condition;
    if (status) updateFields.status = status;
    if (originalPrice !== undefined && !isNaN(Number(originalPrice))) {
      updateFields.originalPrice = Number(originalPrice);
    }
    if (sellingPrice !== undefined && !isNaN(Number(sellingPrice))) {
      updateFields.sellingPrice = Number(sellingPrice);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    ).populate('sellerId', 'name email address');

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update book details',
      error: error.message,
    });
  }
};

// ================= SELLER SPECIFIC METHODS =================

// Get all listings belonging to authenticated seller
export const getSellerListings = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user._id }).sort({ createdAt: -1 });

    const totalListed = books.length;
    const pendingCount = books.filter((b) => b.status === 'pending').length;
    const approvedCount = books.filter((b) => b.status === 'approved').length;
    const soldCount = books.filter((b) => b.status === 'sold').length;
    const rejectedCount = books.filter((b) => b.status === 'rejected').length;

    // Total earnings from sold books (based on seller asking price or selling price)
    const totalEarnings = books
      .filter((b) => b.status === 'sold')
      .reduce((sum, b) => sum + (b.sellerAskingPrice || b.sellingPrice || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalListed,
        pendingCount,
        approvedCount,
        soldCount,
        rejectedCount,
        totalEarnings,
      },
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch seller listings',
      error: error.message,
    });
  }
};

// Update a seller's own book listing
export const updateSellerBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, originalPrice, sellerAskingPrice, condition, images, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const book = await Book.findOne({ _id: id, sellerId: req.user._id });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or access denied',
      });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (condition) book.condition = condition;
    if (type) book.type = type;
    if (images && Array.isArray(images) && images.length > 0) book.images = images;

    if (originalPrice !== undefined && !isNaN(Number(originalPrice))) {
      book.originalPrice = Number(originalPrice);
    }

    if (sellerAskingPrice !== undefined && !isNaN(Number(sellerAskingPrice))) {
      book.sellerAskingPrice = Number(sellerAskingPrice);
      // If book is pending, also sync sellingPrice
      if (book.status === 'pending') {
        book.sellingPrice = Number(sellerAskingPrice);
      }
    }

    // If previously rejected, allow re-submitting for review
    if (book.status === 'rejected') {
      book.status = 'pending';
    }

    await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book listing updated successfully',
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update book listing',
      error: error.message,
    });
  }
};

// Delete / Withdraw a seller's own book listing
export const deleteSellerBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const book = await Book.findOneAndDelete({ _id: id, sellerId: req.user._id });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or access denied',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Book "${book.title}" was removed successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete book listing',
      error: error.message,
    });
  }
};

