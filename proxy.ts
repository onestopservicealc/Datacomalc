import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

/**
 * Middleware ป้องกันทุก route — ยังไม่ login เด้งไป /auth/sign-in
 * (Next.js 16 ใช้ชื่อไฟล์ proxy.ts แทน middleware.ts)
 *
 * ข้อยกเว้น: Server Action (POST + header next-action) ไม่ผ่าน auth middleware
 * เพราะ middleware ทำ redirect/response เพี้ยนกับ action request → action ค้าง
 * ปลอดภัย: หน้าถูก guard ที่ (app)/layout (AuthGuard: session + whitelist) แล้ว
 * action จึงรันได้เฉพาะหลัง user โหลดหน้าที่ผ่าน guard มาแล้ว
 */
const authMiddleware = auth.middleware({ loginUrl: "/auth/sign-in" });

export default function proxy(req: NextRequest) {
  if (req.method === "POST" && req.headers.has("next-action")) {
    return NextResponse.next();
  }
  return authMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/sign-in).*)",
  ],
};
