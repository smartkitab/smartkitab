import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

// Buyer authenticated routes
router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.patch('/:id/cancel', verifyToken, cancelMyOrder);

// Admin routes
router.get('/all', verifyToken, isAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;

