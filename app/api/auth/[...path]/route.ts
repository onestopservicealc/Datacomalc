import { auth } from "@/lib/auth/server";

/** Neon Auth API — รับ request auth ทั้งหมด (magic link, get-session, sign-out ฯลฯ) */
export const { GET, POST } = auth.handler();
