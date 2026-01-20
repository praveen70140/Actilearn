import { object, string } from 'zod';

export const registerUserSchema = object({
  name: string({ error: 'Name is required' }).min(
    3,
    'Name must be at least 3 charcters long',
  ),
  username: string({ error: 'Username is required' }).min(
    3,
    'Username must be at least 3 characters long',
  ),
  password: string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .refine(
      (password) => /[A-Z]/.test(password), // At least one uppercase
      { message: 'Password must contain an uppercase letter' },
    )
    .refine(
      (password) => /[0-9]/.test(password), // At least one number
      { message: 'Password must contain a number' },
    )
    .refine(
      (password) => /[^A-Za-z0-9]/.test(password), // At least one special char
      { message: 'Password must contain a special character' },
    ),
  confirmPassword: string({ error: 'Password confirmation is required' }).min(
    8,
    'Password must be at least 8 characters long',
  ),
}).refine((data) => data.password === data.confirmPassword, {
  error: 'Passwords must match',
});
