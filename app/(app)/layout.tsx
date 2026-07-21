import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import NoAccess from "@/components/NoAccess";
import { auth } from "@/lib/auth/server";
import { isAllowed } from "@/lib/auth/allowlist";
import { isAdmin } from "@/lib/auth/admin-emails";
import { getCounts } from "@/lib/actions";

// getSession อ่าน cookie → ต้อง render แบบ dynamic (ห้าม prerender static)
export const dynamic = "force-dynamic";

/**
 * Layout แอปหลัก (route group (app)) — resolve auth + counts ฝั่ง server ครั้งเดียว:
 * 1) ยังไม่ login → เด้ง /auth/sign-in (middleware ทำอยู่แล้ว, กันซ้ำ)
 * 2) login แล้วแต่อีเมลไม่อยู่ใน whitelist → หน้า "ไม่มีสิทธิ์เข้าใช้งาน"
 * 3) ผ่าน → ดึง counts + ส่ง email/isAdmin/counts เป็น prop ให้ AppShell
 *    (AppShell ไม่ต้อง useSession / getCounts ฝั่ง client อีก — ตัด fetch หลัง hydrate)
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const email = session.user.email;
  if (!(await isAllowed(email))) {
    return <NoAccess email={email} />;
  }

  const initialCounts = await getCounts();

  return (
    <AppShell
      email={email}
      admin={isAdmin(email)}
      initialCounts={initialCounts}
    >
      {children}
    </AppShell>
  );
}
