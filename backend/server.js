import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartkitab';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(`Connected to MongoDB successfully: ${MONGO_URI}`);
    try {
      const User = (await import('./models/User.js')).default;
      await User.findOneAndUpdate(
        { email: 'admin@smartkitab.com' },
        {
          $set: {
            role: 'superadmin',
            permissions: {
              canManageBooks: true,
              canManageOrders: true,
              canManageCMS: true,
              canManageCurations: true,
              canManageUsers: true,
              canManageAdmins: true,
            },
          },
        }
      );
    } catch (e) {
      console.warn('Superadmin auto-promote note:', e.message);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SMARTKITAB Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/orders', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
