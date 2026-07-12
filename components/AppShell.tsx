"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SCHEMA } from "@/lib/schema";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
import { DATA_CHANGED_EVENT, getStore } from "@/lib/data";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<AssetType, number> | null>(null);

  const loadCounts = useCallback(async () => {
    const store = getStore();
    const entries = await Promise.all(
      ASSET_TYPES.map(async (t) => [t, (await store.list(t)).length] as const),
    );
    setCounts(Object.fromEntries(entries) as Record<AssetType, number>);
  }, []);

  useEffect(() => {
    // โหลดข้อมูลตอน mount — DataStore เป็น async (เตรียมไว้สำหรับ Supabase) setState จึงไม่ synchronous จริง
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
            <span className="dot" style={{ background: "var(--warn)" }}></span>
            <span>ข้อมูลบันทึกในเบราว์เซอร์เครื่องนี้</span>
          </div>
        </div>
        <nav className="tabs">
          <button className={active("/")} onClick={() => router.push("/")}>
            <i className="ti ti-layout-dashboard"></i> ภาพรวม
          </button>
          {ASSET_TYPES.map((t) => (
            <button
              key={t}
              className={active(`/${t}`)}
              onClick={() => router.push(`/${t}`)}
            >
              <i className={`ti ${SCHEMA[t].icon}`}></i> {SCHEMA[t].label}{" "}
              <span className="cnt">{counts ? counts[t] : "…"}</span>
            </button>
          ))}
        </nav>
      </header>
      <div className="wrap">{children}</div>
    </>
  );
}
