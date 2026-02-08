import { Router } from 'express';
import { processVoiceAudio } from '../controllers/voice.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post('/process', upload.single('audio'), processVoiceAudio);

export default router;
