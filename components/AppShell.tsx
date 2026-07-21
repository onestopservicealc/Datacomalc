"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHEMA } from "@/lib/schema";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
import { DATA_CHANGED_EVENT } from "@/lib/data";
import { getCounts } from "@/lib/actions";
import { signOutAction } from "@/lib/auth/actions";

export default function AppShell({
  children,
  email,
  admin,
  initialCounts,
}: {
  children: React.ReactNode;
  email: string;
  admin: boolean;
  initialCounts: Record<AssetType, number>;
}) {
  const pathname = usePathname();
  // seed counts จาก server — ไม่ fetch ตอน mount
  const [counts, setCounts] = useState<Record<AssetType, number>>(initialCounts);

  // reload counts เฉพาะหลัง mutation (event) — ไม่ยิงตอน mount
  const reloadCounts = useCallback(async () => {
    try {
      setCounts(await getCounts());
    } catch (err) {
      console.error("โหลดจำนวนครุภัณฑ์ไม่สำเร็จ:", err);
    }
  }, []);

  useEffect(() => {
    window.addEventListener(DATA_CHANGED_EVENT, reloadCounts);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, reloadCounts);
  }, [reloadCounts]);

  const active = (path: string) => (pathname === path ? "active" : "");

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <div className="logo">สค</div>
          <div className="title">
            <h1>ทะเบียนครุภัณฑ์คอมพิวเตอร์ สคอ.</h1>
            <p>ระบบจัดเก็บและค้นหาข้อมูลครุภัณฑ์ไอที</p>
          </div>
          <div className="top-spacer"></div>
          <div className="sync">
            <span className="dot" style={{ background: "var(--ok)" }}></span>
            <span>{email}</span>
          </div>
          <button
            className="btn ghost"
            onClick={() => signOutAction()}
            title="ออกจากระบบ"
          >
            <i className="ti ti-logout"></i> ออกจากระบบ
          </button>
        </div>
        <nav className="tabs">
          <Link href="/" className={active("/")}>
            <i className="ti ti-layout-dashboard"></i> ภาพรวม
          </Link>
          {ASSET_TYPES.map((t) => (
            <Link key={t} href={`/${t}`} className={active(`/${t}`)}>
              <i className={`ti ${SCHEMA[t].icon}`}></i> {SCHEMA[t].label}{" "}
              <span className="cnt">{counts[t]}</span>
            </Link>
          ))}
          {admin && (
            <Link href="/admin" className={active("/admin")}>
              <i className="ti ti-user-shield"></i> ผู้ดูแลระบบ
            </Link>
          )}
        </nav>
      </header>
      <div className="wrap">{children}</div>
    </>
  );
}
