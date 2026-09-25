import mongoose from 'mongoose';

const bookCategories = [
  'Novels',
  'Pocket Books',
  'Engineering',
  'Medical',
  'SEE Prep',
  'IELTS & Language',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Bachelor Courses',
];

const bookConditions = ['Like New', 'Good Condition', 'Fair Condition'];
const bookStatuses = ['pending', 'approved', 'rejected', 'sold'];
const bookListingTypes = ['sale', 'donation'];

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    sellerAskingPrice: {
      type: Number,
      default: 0,
      min: [0, 'Seller asking price cannot be negative'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: bookConditions,
        message: '{VALUE} is not a valid condition',
      },
    },
    images: {
      type: [String],
      required: [true, 'Images are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one image URL is required',
      },
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: bookStatuses,
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    type: {
      type: String,
      enum: {
        values: bookListingTypes,
        message: '{VALUE} is not a valid listing type',
      },
      default: 'sale',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: {
      type: Number,
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    bestSellerOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;

