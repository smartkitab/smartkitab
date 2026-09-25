import { Router } from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBookStatus,
  updateBookDetails,
  getSellerListings,
  updateSellerBook,
  deleteSellerBook,
} from '../controllers/bookController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllBooks);

// Seller authenticated routes (must precede /:id to avoid treating "seller" as an ID)
router.get('/seller/my-listings', verifyToken, getSellerListings);
router.put('/seller/:id', verifyToken, updateSellerBook);
router.delete('/seller/:id', verifyToken, deleteSellerBook);

router.get('/:id', getBookById);

// Authenticated create route
router.post('/', verifyToken, createBook);

// Admin-only routes
router.patch('/:id/status', verifyToken, isAdmin, updateBookStatus);
router.put('/:id', verifyToken, isAdmin, updateBookDetails);

export default router;


