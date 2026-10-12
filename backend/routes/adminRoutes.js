import { Router } from 'express';
import {
  getPendingBooks,
  getAdminStats,
  getStaffUsers,
  createStaffUser,
  updateStaffPermissions,
  deleteStaffUser,
  getCurations,
  updateBookCuration,
} from '../controllers/adminController.js';
import { updateSiteSettings, resetSiteSettings } from '../controllers/siteSettingsController.js';
import { verifyToken, isAdmin, isSuperAdmin, requirePermission } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication and admin/superadmin role verification
router.use(verifyToken, isAdmin);

// Overview & Analytics
router.get('/stats', getAdminStats);

// Books Management
router.get('/pending-books', requirePermission('canManageBooks'), getPendingBooks);

// Curations (Featured & Bestsellers)
router.get('/curations', requirePermission('canManageCurations'), getCurations);
router.put('/curations/:id', requirePermission('canManageCurations'), updateBookCuration);

// CMS Site Settings routes
router.put('/site-settings', requirePermission('canManageCMS'), updateSiteSettings);
router.post('/site-settings/reset', requirePermission('canManageCMS'), resetSiteSettings);

// Staff & Super Admin Role-Based Access Control
router.get('/staff', requirePermission('canManageAdmins'), getStaffUsers);
router.post('/staff', isSuperAdmin, createStaffUser);
router.put('/staff/:id/permissions', isSuperAdmin, updateStaffPermissions);
router.delete('/staff/:id', isSuperAdmin, deleteStaffUser);

export default router;
