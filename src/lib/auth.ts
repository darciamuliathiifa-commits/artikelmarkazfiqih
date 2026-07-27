import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { users, sessions, accounts, verifications } from "@/db/schema";

export const auth = betterAuth({
  ...(process.env.BETTER_AUTH_URL ? { baseURL: process.env.BETTER_AUTH_URL } : {}),
  secret: process.env.BETTER_AUTH_SECRET || "markaz-fiqih-default-secret-key-2026",
  trustedOrigins: [
    "https://markazfiqih.com",
    "https://www.markazfiqih.com",
    "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: { users, sessions, accounts, verifications },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    fields: {
      image: "avatarUrl",
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "kontributor",
      },
      slug: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
      longBio: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});
