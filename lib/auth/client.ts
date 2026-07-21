import { createAuthClient } from "@neondatabase/auth/next";

/** Neon Auth client — ใช้ใน client component (useSession, signIn.magicLink, signOut) */
export const authClient = createAuthClient();
