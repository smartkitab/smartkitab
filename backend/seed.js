import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Book from './models/Book.js';
import Order from './models/Order.js';
import BookRequest from './models/BookRequest.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartkitab';

const sampleBooks = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Novels',
    originalPrice: 650,
    sellingPrice: 350,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Novels',
    originalPrice: 500,
    sellingPrice: 250,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
  {
    title: 'Psychology of Money',
    author: 'Morgan Housel',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 300,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 280,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Novels',
    originalPrice: 600,
    sellingPrice: 320,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    category: 'Novels',
    originalPrice: 550,
    sellingPrice: 260,
    condition: 'Good Condition',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    type: 'sale',
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);

    // Clear existing collections
    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Order.deleteMany({}),
      BookRequest.deleteMany({}),
    ]);
    console.log('Cleared existing records.');

    // Hash password for sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create sample users
    console.log('Seeding users...');
    const users = await User.create([
      {
        name: 'SMARTKITAB Admin',
        email: 'admin@smartkitab.com',
        password: hashedPassword,
        role: 'admin',
        isBookCycleSubscriber: true,
        address: {
          street: 'Putalisadak',
          city: 'Kathmandu',
          phone: '9800000001',
        },
      },
      {
        name: 'Sample Seller',
        email: 'seller@smartkitab.com',
        password: hashedPassword,
        role: 'seller',
        isBookCycleSubscriber: false,
        address: {
          street: 'New Road',
          city: 'Kathmandu',
          phone: '9800000002',
        },
      },
      {
        name: 'Sample Buyer',
        email: 'buyer@smartkitab.com',
        password: hashedPassword,
        role: 'buyer',
        isBookCycleSubscriber: false,
        address: {
          street: 'Baneshwor',
          city: 'Kathmandu',
          phone: '9800000003',
        },
      },
    ]);

    const seller = users.find((user) => user.role === 'seller');

    // 2. Create 6 approved sample books
    console.log('Seeding sample books...');
    const booksWithSeller = sampleBooks.map((book) => ({
      ...book,
      sellerId: seller._id,
    }));

    const createdBooks = await Book.insertMany(booksWithSeller);

    console.log(' Database successfully seeded!');
    console.log(`- Created ${users.length} Users (Admin, Seller, Buyer)`);
    console.log(`- Created ${createdBooks.length} Approved Books linked to seller (${seller.email})`);

    process.exit(0);
  } catch (error) {
    console.error('Error while seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();

