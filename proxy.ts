import { auth } from "@/lib/auth/server";

/**
 * Middleware ป้องกันทุก route — ยังไม่ login เด้งไป /auth/sign-in
 * (Next.js 16 ใช้ชื่อไฟล์ proxy.ts แทน middleware.ts)
 */
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  // ยกเว้น static, favicon, API auth (ต้องเข้าถึงได้ตอนยังไม่ login) และหน้า sign-in เอง
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/sign-in).*)",
  ],
};
