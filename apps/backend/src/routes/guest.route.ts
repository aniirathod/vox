import { Router } from 'express';
import { createGuestUser } from '../controllers/guest.controller';

const router = Router();

router.post('/create', createGuestUser);

export default router;
