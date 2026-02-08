import { Router } from 'express';
import { saveWebsiteContent, getWebsite, getUserWebsites } from '../controllers/website.controller';

const router = Router();

/**
 * POST /api/website/save
 * Saves website content after voice processing
 */
router.post('/save', saveWebsiteContent);

/**
 * GET /api/website/:slug
 * Retrieves a website by its slug
 */
router.get('/:slug', getWebsite);

/**
 * GET /api/website/user/:userId
 * Gets all websites for a specific user
 */
router.get('/user/:userId', getUserWebsites);

export default router;
