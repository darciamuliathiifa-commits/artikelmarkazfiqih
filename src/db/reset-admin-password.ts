import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db } from "./index";
import { users, accounts } from "./schema";

async function resetAdminPassword() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const newPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !newPassword) {
    console.error(
      "ADMIN_SEED_EMAIL dan ADMIN_SEED_PASSWORD wajib diset di environment variables / .env.local"
    );
    process.exit(1);
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    console.error(`User dengan email ${email} tidak ditemukan di database.`);
    process.exit(1);
  }

  const hash = await hashPassword(newPassword);

  const existingAccount = await db.query.accounts.findFirst({
    where: eq(accounts.userId, existingUser.id),
  });

  if (existingAccount) {
    await db
      .update(accounts)
      .set({ password: hash })
      .where(eq(accounts.id, existingAccount.id));
  } else {
    await db.insert(accounts).values({
      userId: existingUser.id,
      providerId: "credential",
      accountId: existingUser.id,
      password: hash,
    });
  }

  console.log(`Password untuk admin ${email} berhasil diperbarui!`);
}

resetAdminPassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
