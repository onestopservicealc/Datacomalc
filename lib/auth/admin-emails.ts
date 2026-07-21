/**
 * รายชื่อ admin (bootstrap ในโค้ด) — โมดูลนี้ไม่ใช่ server-only
 * จึง import ได้ทั้งฝั่ง client (แสดง/ซ่อนเมนู admin) และ server (isAdmin)
 * การเพิ่ม/ลบ "ผู้ใช้ทั่วไป" ทำผ่านหน้า admin (ตาราง Neon) ไม่ต้องแก้ไฟล์นี้
 * แก้ไฟล์นี้เฉพาะตอนต้องการเปลี่ยนตัว "ผู้ดูแล"
 */
export const ADMIN_EMAILS = ["webex.alc@ddc.mail.go.th"];

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
