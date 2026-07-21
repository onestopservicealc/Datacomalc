/** รหัสผ่านเข้าระบบ (แบบง่าย สำหรับใช้งานภายใน) */
export const PASSCODE = "3373";

/** flag ใน sessionStorage ว่าปลดล็อกแล้ว — หมดอายุเมื่อปิดแท็บ */
export const GATE_KEY = "datacomalc:unlocked";

/** ล็อกระบบใหม่ (ออกจากระบบ) แล้วโหลดหน้าใหม่เพื่อกลับไปหน้าใส่รหัส */
export function lock() {
  sessionStorage.removeItem(GATE_KEY);
  window.location.reload();
}
