// Reusable Prisma Client instance that works both in development (with hot reload)
// and production without creating too many database connections.
// Docs: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client#solution

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
