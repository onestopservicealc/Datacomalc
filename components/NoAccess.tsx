"use client";

import { signOutAction } from "@/lib/auth/actions";

/** หน้าแสดงเมื่อ login สำเร็จแต่อีเมลไม่อยู่ใน whitelist */
export default function NoAccess({ email }: { email: string }) {
  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-logo" style={{ background: "var(--danger)" }}>
          <i className="ti ti-lock"></i>
        </div>
        <h1>ไม่มีสิทธิ์เข้าใช้งาน</h1>
        <p>
          บัญชี <b>{email}</b> ยังไม่ได้รับอนุญาตให้เข้าใช้งานระบบนี้
          กรุณาติดต่อผู้ดูแลระบบ
        </p>
        <button className="btn primary gate-btn" onClick={() => signOutAction()}>
          <i className="ti ti-logout"></i> ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
