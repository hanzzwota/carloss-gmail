// Mock Prisma client for environment compatibility without requiring @prisma/client package
const noOpPrisma = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: any) => d?.data ?? {},
  update: async (d: any) => d?.data ?? {},
  delete: async () => ({}),
  $connect: async () => {},
  $disconnect: async () => {},
};

const mockPrisma = new Proxy({}, {
  get: (_, prop) => {
    if (prop === '$connect' || prop === '$disconnect') return async () => {};
    return noOpPrisma;
  },
});

export const prisma = (globalThis as any).prisma || mockPrisma;
if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = prisma;

