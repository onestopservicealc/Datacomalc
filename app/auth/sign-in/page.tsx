"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { checkEmailAllowed } from "@/lib/auth/actions";

/**
 * หน้า login — Email OTP (แทน passcode gate เดิม)
 * ขั้นที่ 1: กรอกอีเมล → ส่งรหัส 6 หลักเข้าเมล
 * ขั้นที่ 2: กรอกรหัส → ยืนยัน → เข้าระบบ
 */
export default function SignInPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!addr) return;

    setBusy(true);
    setError("");

    // pre-check ผ่าน server action (บังคับจริงที่ AuthGuard ฝั่ง server อีกชั้น)
    if (!(await checkEmailAllowed(addr))) {
      setBusy(false);
      setError("อีเมลนี้ไม่ได้รับอนุญาตให้เข้าใช้งานระบบ");
      return;
    }

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: addr,
      type: "sign-in",
    });
    setBusy(false);
    if (error) {
      setError(error.message || "ส่งรหัสไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    setEmail(addr);
    setStep("otp");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.trim();
    if (!code) return;

    setBusy(true);
    setError("");
    const { error } = await authClient.signIn.emailOtp({ email, otp: code });
    if (error) {
      setBusy(false);
      setError(error.message || "รหัสไม่ถูกต้องหรือหมดอายุ");
      return;
    }
    // เข้าระบบสำเร็จ — ไปหน้าแรก (reload เต็มเพื่อให้ server guard เห็น cookie ใหม่)
    window.location.href = "/";
  }

  if (step === "otp") {
    return (
      <div className="gate">
        <form className="gate-card" onSubmit={verify}>
          <div className="gate-logo" style={{ background: "var(--ok)" }}>
            <i className="ti ti-mail-check"></i>
          </div>
          <h1>กรอกรหัสยืนยัน</h1>
          <p>
            ส่งรหัส 6 หลักไปที่ <b>{email}</b> แล้ว กรอกรหัสด้านล่างเพื่อเข้าระบบ
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
          />
          {error && <div className="gate-err">{error}</div>}
          <button
            type="submit"
            className="btn primary gate-btn"
            disabled={busy}
          >
            {busy ? (
              <>
                <i className="ti ti-loader-2"></i> กำลังตรวจสอบ…
              </>
            ) : (
              <>
                <i className="ti ti-login-2"></i> เข้าสู่ระบบ
              </>
            )}
          </button>
          <button
            type="button"
            className="btn gate-btn"
            style={{ marginTop: 8 }}
            onClick={() => {
              setStep("email");
              setOtp("");
              setError("");
            }}
          >
            <i className="ti ti-arrow-left"></i> ใช้อีเมลอื่น
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={sendCode}>
        <div className="gate-logo">สค</div>
        <h1>ทะเบียนครุภัณฑ์คอมพิวเตอร์ สคอ.</h1>
        <p>กรอกอีเมลเพื่อรับรหัสเข้าสู่ระบบ</p>
        <input
          type="email"
          inputMode="email"
          autoFocus
          placeholder="you@ddc.mail.go.th"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            letterSpacing: "normal",
            textAlign: "left",
          }}
        />
        {error && <div className="gate-err">{error}</div>}
        <button type="submit" className="btn primary gate-btn" disabled={busy}>
          {busy ? (
            <>
              <i className="ti ti-loader-2"></i> กำลังส่ง…
            </>
          ) : (
            <>
              <i className="ti ti-mail"></i> ส่งรหัสเข้าอีเมล
            </>
          )}
        </button>
      </form>
    </div>
  );
}
