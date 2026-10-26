import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaClientSingleton = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton;
};

function createClient() {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("prisma+postgres://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { withAccelerate } = require("@prisma/extension-accelerate");
    return new PrismaClient().$extends(withAccelerate());
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
