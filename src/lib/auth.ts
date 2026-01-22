import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db'; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  trustedOrigins: ['http://localhost:3000', 'http://192.168.1.10:3000'],
  emailAndPassword: {
    enabled: true,
  },
  // Disabled for server side execution
  advanced: { disableOriginCheck: true },
});
