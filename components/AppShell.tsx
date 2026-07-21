"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHEMA } from "@/lib/schema";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
import { DATA_CHANGED_EVENT } from "@/lib/data";
import { getCounts } from "@/lib/actions";
import { lock } from "@/lib/gate";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<AssetType, number> | null>(null);

  const loadCounts = useCallback(async () => {
    try {
      setCounts(await getCounts()); // query เดียว (count) ทุก type
    } catch (err) {
      console.error("โหลดจำนวนครุภัณฑ์ไม่สำเร็จ:", err);
      setCounts(
        Object.fromEntries(ASSET_TYPES.map((t) => [t, 0])) as Record<
          AssetType,
          number
        >,
      );
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCounts();
    window.addEventListener(DATA_CHANGED_EVENT, loadCounts);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, loadCounts);
  }, [loadCounts]);

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
            <span>เชื่อมต่อฐานข้อมูล Neon</span>
          </div>
          <button className="btn ghost" onClick={lock} title="ออกจากระบบ">
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
              <span className="cnt">{counts ? counts[t] : "…"}</span>
            </Link>
          ))}
        </nav>
      </header>
      <div className="wrap">{children}</div>
    </>
  );
}
