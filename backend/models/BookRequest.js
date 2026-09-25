import mongoose from 'mongoose';

const bookRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'fulfilled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const BookRequest = mongoose.model('BookRequest', bookRequestSchema);

export default BookRequest;

