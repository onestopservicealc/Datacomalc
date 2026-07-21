"use client";

import { useState } from "react";
import {
  addAllowedEmail,
  getAllowedList,
  removeAllowedEmail,
} from "@/lib/auth/actions";
import { Toast, useToast } from "./Toast";

type Row = { email: string; added_at: string; added_by: string | null };

export default function AdminEmails({
  initial,
  adminEmails,
}: {
  initial: Row[];
  adminEmails: string[];
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast, show } = useToast();

  async function refresh() {
    setRows(await getAllowedList());
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!addr) return;
    setBusy(true);
    try {
      await addAllowedEmail(addr);
      setEmail("");
      await refresh();
      show("เพิ่มอีเมลแล้ว");
    } catch (err) {
      show(err instanceof Error ? err.message : "เพิ่มไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  async function remove(addr: string) {
    if (!confirm(`ลบสิทธิ์ของ ${addr}?`)) return;
    try {
      await removeAllowedEmail(addr);
      await refresh();
      show("ลบอีเมลแล้ว");
    } catch (err) {
      show(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  }

  const isAdminEmail = (e: string) =>
    adminEmails.includes(e.toLowerCase());

  return (
    <div className="panel">
      <form className="toolbar" onSubmit={add}>
        <div className="search">
          <i className="ti ti-mail ic"></i>
          <input
            type="email"
            placeholder="เพิ่มอีเมลที่อนุญาต… (you@example.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn primary" disabled={busy}>
          <i className="ti ti-plus"></i> เพิ่มอีเมล
        </button>
      </form>

      <div className="card">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>อีเมล</th>
                <th>เพิ่มเมื่อ</th>
                <th>เพิ่มโดย</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty">
                      <i className="ti ti-inbox"></i>
                      ยังไม่มีอีเมลในรายชื่อ
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.email}>
                    <td>
                      {r.email}
                      {isAdminEmail(r.email) && (
                        <span className="badge store" style={{ marginLeft: 8 }}>
                          ผู้ดูแล
                        </span>
                      )}
                    </td>
                    <td className="muted">{r.added_at?.slice(0, 10)}</td>
                    <td className="muted">{r.added_by ?? "-"}</td>
                    <td>
                      <div className="rowact" style={{ opacity: 1 }}>
                        {!isAdminEmail(r.email) && (
                          <div
                            className="iconbtn del"
                            title="ลบสิทธิ์"
                            onClick={() => remove(r.email)}
                          >
                            <i className="ti ti-trash"></i>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="count-note">
        อนุญาต {rows.length} อีเมล — ผู้ดูแลเข้าได้เสมอแม้ไม่อยู่ในรายชื่อ
      </p>
      <Toast toast={toast} />
    </div>
  );
}
