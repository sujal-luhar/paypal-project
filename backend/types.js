const z = require("zod")

const userZod = z.strictObject({
  username: z
    .string()
    .min(3, { message: 'username must be at least 3 characters' })
    .max(30, { message: 'username must be at most 30 characters' })
    .trim()
    .toLowerCase()
    .regex(/^[\w.-]+$/, { message: 'username contains invalid characters' }), // allow letters, numbers, underscore, dot, dash
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' }),
  firstName: z
    .string()
    .min(1, { message: 'firstName is required' })
    .max(50, { message: 'firstName must be at most 50 characters' })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'lastName is required' })
    .max(50, { message: 'lastName must be at most 50 characters' })
    .trim(),
});

const userSigninZod = z.strictObject({
  username: z
    .string()
    .min(3, { message: 'username must be at least 3 characters' })
    .max(30, { message: 'username must be at most 30 characters' })
    .trim()
    .toLowerCase()
    .regex(/^[\w.-]+$/, { message: 'username contains invalid characters' }), // allow letters, numbers, underscore, dot, dash
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' }),
});

module.exports = {
    userZod: userZod,
    userSigninZod: userSigninZod,
}