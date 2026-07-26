import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db } from "./index";
import { users, accounts } from "./schema";
import { slugify } from "../lib/slugify";

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME ?? "Admin Markaz Fiqih";

  if (!email || !password) {
    console.error(
      "ADMIN_SEED_EMAIL dan ADMIN_SEED_PASSWORD wajib diset di .env.local"
    );
    process.exit(1);
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    console.log(`Admin dengan email ${email} sudah ada. Melewati seeding.`);
    process.exit(0);
  }

  const slug = slugify(name) || "admin";

  const [createdUser] = await db
    .insert(users)
    .values({
      name,
      email,
      emailVerified: true,
      slug,
      role: "admin",
    })
    .returning();

  const hash = await hashPassword(password);

  await db.insert(accounts).values({
    userId: createdUser.id,
    providerId: "credential",
    accountId: createdUser.id,
    password: hash,
  });

  console.log(`Admin berhasil dibuat: ${email}`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
