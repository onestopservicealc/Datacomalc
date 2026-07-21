import AuthGuard from "@/components/AuthGuard";
import AppShell from "@/components/AppShell";

// getSession อ่าน cookie → ต้อง render แบบ dynamic (ห้าม prerender static)
export const dynamic = "force-dynamic";

/**
 * Layout ของแอปหลัก (route group (app)) — ทุกหน้าในนี้ต้อง login + อยู่ใน whitelist
 * AuthGuard เช็ค session ฝั่ง server ก่อน แล้วค่อย render AppShell + หน้า
 * หน้า /auth/sign-in อยู่นอก group นี้ จึงไม่โดน guard (กัน redirect loop)
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
