import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import clientPromise from '@/lib/mongodb';
import { nextCookies } from 'better-auth/next-js';

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  trustHost: true,
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  // Disabled for server side execution
  advanced: { disableOriginCheck: true },
});
