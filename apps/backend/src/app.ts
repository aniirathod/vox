import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRoutes from './routes/guest.route';
import voiceRoutes from './routes/voice.route';
import websiteRoutes from './routes/website.route';

dotenv.config();

const app = express();
// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/guest', guestRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/website', websiteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]', err);

  // Multer errors
  if (err.message?.includes('Invalid audio format')) {
    return res.status(400).json({
      error: 'INVALID_AUDIO_FORMAT',
      message: err.message,
    });
  }

  if (err.message?.includes('File too large')) {
    return res.status(400).json({
      error: 'FILE_TOO_LARGE',
      message: 'Audio file must be under 10MB',
    });
  }

  // Generic error
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
});

export default app;
