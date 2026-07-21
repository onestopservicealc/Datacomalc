import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Neon Auth (Managed Better Auth) — instance ฝั่ง server
 * ใช้ใน server component, server action, route handler, middleware
 * env: NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET (ได้จาก Neon Console → Auth)
 */
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
