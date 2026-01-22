import { email, object, string } from 'zod';

export const loginUserSchema = object({
  email: email({ error: 'Email is required' }).min(1, 'Email is required'),
  password: string({ error: 'Password is required' }).min(
    1,
    'Password is required',
  ),
});
