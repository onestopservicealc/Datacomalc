"use client";

import { useEffect, useState } from "react";
import { GATE_KEY, PASSCODE } from "@/lib/gate";
import Icon from "./Icon";

export default function PasscodeGate({
  children,
}: {
  children: React.ReactNode;
}) {
  // null = ยังไม่ได้ตรวจ sessionStorage (กันหน้ากะพริบตอน hydrate)
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // อ่าน sessionStorage ตอน mount (client เท่านั้น) กันหน้ากะพริบตอน hydrate
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(sessionStorage.getItem(GATE_KEY) === "1");
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === PASSCODE) {
      sessionStorage.setItem(GATE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setCode("");
    }
  }

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={submit}>
        <div className="gate-logo">สค</div>
        <h1>ทะเบียนครุภัณฑ์คอมพิวเตอร์ สคอ.</h1>
        <p>กรอกรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          placeholder="••••"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
        />
        {error && <div className="gate-err">รหัสผ่านไม่ถูกต้อง</div>}
        <button type="submit" className="btn primary gate-btn">
          <Icon name="lock-open" /> เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
