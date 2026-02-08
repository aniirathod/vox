import { prisma } from './prisma';

export const verifyPrismaConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ DB Connected');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  }
};
