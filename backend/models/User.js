import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: ['buyer', 'seller', 'admin', 'superadmin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'buyer',
    },
    permissions: {
      canManageBooks: { type: Boolean, default: true },
      canManageOrders: { type: Boolean, default: true },
      canManageCMS: { type: Boolean, default: true },
      canManageCurations: { type: Boolean, default: true },
      canManageUsers: { type: Boolean, default: false },
      canManageAdmins: { type: Boolean, default: false },
    },
    isBookCycleSubscriber: {
      type: Boolean,
      default: false,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    payoutInfo: {
      method: { type: String, default: 'eSewa' }, // eSewa, Khalti, Bank Transfer, Cash
      accountNumber: { type: String, default: '' },
      accountName: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;

