import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { isAllowed } from "@/lib/auth/allowlist";
import NoAccess from "./NoAccess";

/**
 * Server guard — ครอบเนื้อหาทั้งแอป
 * 1) ยังไม่ login → เด้งไป /auth/sign-in (middleware ทำอยู่แล้ว, กันซ้ำ)
 * 2) login แล้วแต่อีเมลไม่อยู่ใน whitelist → หน้า "ไม่มีสิทธิ์เข้าใช้งาน"
 * 3) ผ่าน → render children (AppShell + หน้า)
 */
export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (!(await isAllowed(session.user.email))) {
    return <NoAccess email={session.user.email} />;
  }

  return <>{children}</>;
}
