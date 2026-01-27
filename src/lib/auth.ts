import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    disableOriginCheck: process.env.NODE_ENV == "development",
  },
  plugins: [nextCookies()],
});
