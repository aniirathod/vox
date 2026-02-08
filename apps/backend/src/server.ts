import app from './app';
import { verifyPrismaConnection } from './db/verifyPrismaConnection';

const PORT = process.env.PORT || 3001;

const start = async () => {
  await verifyPrismaConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
