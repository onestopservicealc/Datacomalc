"use server";

import { sql } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { isAdmin, isAllowed, listAllowed } from "@/lib/auth/allowlist";

/**
 * Server actions สำหรับ whitelist
 * - checkEmailAllowed: ให้หน้า sign-in (client) pre-check ก่อนส่ง OTP
 * - add/remove/getAllowedList: จัดการ whitelist — ต้องเป็น admin เท่านั้น
 */

/** pre-check ฝั่ง client — ปลอดภัยที่จะเปิดให้เรียกโดยไม่ต้อง login (ตอบแค่ true/false) */
export async function checkEmailAllowed(email: string): Promise<boolean> {
  return isAllowed(email);
}

/** ยืนยันว่า caller login แล้วและเป็น admin — ไม่ใช่ → throw */
async function assertAdmin(): Promise<string> {
  const { data: session } = await auth.getSession();
  const email = session?.user?.email;
  if (!isAdmin(email)) {
    throw new Error("เฉพาะผู้ดูแลระบบเท่านั้นที่จัดการรายชื่อได้");
  }
  return email!.toLowerCase();
}

export async function getAllowedList() {
  await assertAdmin();
  return listAllowed();
}

export async function addAllowedEmail(email: string): Promise<void> {
  const admin = await assertAdmin();
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) throw new Error("อีเมลไม่ถูกต้อง");
  await sql`
    insert into allowed_emails (email, added_by)
    values (${e}, ${admin})
    on conflict (email) do nothing
  `;
}

export async function removeAllowedEmail(email: string): Promise<void> {
  await assertAdmin();
  const e = email.trim().toLowerCase();
  // กันลบ admin bootstrap (ยังไงก็ผ่าน isAllowed แต่ไม่ให้หายจากลิสต์ให้งง)
  if (isAdmin(e)) throw new Error("ลบผู้ดูแลระบบไม่ได้");
  await sql`delete from allowed_emails where email = ${e}`;
}
