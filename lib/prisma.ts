import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prisma will automatically use DATABASE_URL from environment
    // Connection pooling is handled by Supabase connection pooler
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

