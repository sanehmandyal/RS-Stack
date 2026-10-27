/**
 * Operator-controlled, one-time creation of the first Super Admin.
 *
 *   BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_NAME="Your Name" \
 *   BOOTSTRAP_ADMIN_PASSWORD='a-long-unique-passphrase' npm run bootstrap:admin --workspace server
 *
 * - Refuses to run if any Super Admin already exists (no accidental second owner).
 * - There is NO public setup endpoint; this script is the only way to create the first account.
 * - Nothing is hard-coded: credentials come from the environment of the operator running it.
 */
import { connectDb, disconnectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/auth.js';
import { hashPassword } from '../services/authService.js';
import { email as emailSchema, password as passwordSchema, plain } from '../validators/common.js';

async function main() {
  const email = emailSchema.parse(env.BOOTSTRAP_ADMIN_EMAIL ?? '');
  const name = plain(100, 1).parse(env.BOOTSTRAP_ADMIN_NAME ?? '');
  const password = passwordSchema.parse(env.BOOTSTRAP_ADMIN_PASSWORD ?? '');

  await connectDb();
  if (await User.exists({ role: 'super_admin' })) {
    console.error('A Super Admin already exists. Use the admin panel (Users) to manage accounts. Nothing was changed.');
    process.exitCode = 1;
  } else {
    await User.create({ email, name, role: 'super_admin', passwordHash: await hashPassword(password), mustChangePassword: false });
    console.log(`Super Admin created for ${email}. Remove BOOTSTRAP_ADMIN_* from your environment now.`);
  }
  await disconnectDb();
}

main().catch(async (err) => {
  console.error(err instanceof Error ? err.message : err);
  await disconnectDb().catch(() => undefined);
  process.exit(1);
});
