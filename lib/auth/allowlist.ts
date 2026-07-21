import "server-only";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/auth/admin-emails";

/**
 * Whitelist อีเมลที่อนุญาตให้เข้าใช้งานระบบ — เก็บในตาราง Neon `allowed_emails`
 * เพิ่ม/ลบผ่านหน้า admin ได้โดยไม่ต้องแก้โค้ด
 * admin (ดู lib/auth/admin-emails.ts) จัดการ whitelist ได้ และผ่าน isAllowed เสมอ
 * (กัน admin ถูกลบออกจากตารางแล้ว lock ตัวเองออก)
 */
export { ADMIN_EMAILS, isAdmin } from "@/lib/auth/admin-emails";

/** อีเมลนี้เข้าใช้งานได้ไหม (admin ผ่านเสมอ, ที่เหลือต้องอยู่ในตาราง) — server-only */
export async function isAllowed(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const e = email.toLowerCase();
  if (isAdmin(e)) return true;
  const rows = (await sql`
    select 1 from allowed_emails where email = ${e} limit 1
  `) as unknown[];
  return rows.length > 0;
}

/** รายชื่ออีเมลทั้งหมดในตาราง (สำหรับหน้า admin) */
export async function listAllowed(): Promise<
  { email: string; added_at: string; added_by: string | null }[]
> {
  return (await sql`
    select email, added_at::text as added_at, added_by
    from allowed_emails
    order by added_at asc
  `) as { email: string; added_at: string; added_by: string | null }[];
}
