import { Router } from 'express';
import { getSiteSettings } from '../controllers/siteSettingsController.js';

const router = Router();

// Public route to get current storefront CMS settings
router.get('/', getSiteSettings);

export default router;

