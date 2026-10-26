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
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate());
  }

  // pg v9 will break 'require'/'prefer'/'verify-ca' — normalize to 'verify-full' now
  const normalizedUrl = url.replace(/sslmode=(prefer|require|verify-ca)/, "sslmode=verify-full");
  const adapter = new PrismaPg({ connectionString: normalizedUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
