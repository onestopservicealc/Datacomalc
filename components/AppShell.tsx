"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHEMA } from "@/lib/schema";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
import { DATA_CHANGED_EVENT } from "@/lib/data";
import { refetchCounts } from "@/lib/actions";
import { lock } from "@/lib/gate";
import Icon from "./Icon";

export default function AppShell({
  children,
  initialCounts,
}: {
  children: React.ReactNode;
  /** จำนวนต่อ type ที่ layout ดึงมาให้ฝั่ง server แล้ว — ไม่มี fetch waterfall ตอน mount */
  initialCounts: Record<AssetType, number>;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<AssetType, number>>(initialCounts);

  // refetch เฉพาะหลังข้อมูลเปลี่ยน (insert/update/delete) — ไม่ยิงตอน mount
  const loadCounts = useCallback(async () => {
    try {
      setCounts(await refetchCounts());
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
    window.addEventListener(DATA_CHANGED_EVENT, loadCounts);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, loadCounts);
  }, [loadCounts]);

  const active = (path: string) => (pathname === path ? "active" : "");

  return (
    <div className="shell">
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
            <Icon name="logout" /> ออกจากระบบ
          </button>
        </div>
        <nav className="tabs">
          <Link href="/" className={active("/")}>
            <Icon name="layout-dashboard" /> ภาพรวม
          </Link>
          {ASSET_TYPES.map((t) => (
            <Link key={t} href={`/${t}`} className={active(`/${t}`)}>
              <Icon name={SCHEMA[t].icon} /> {SCHEMA[t].label}{" "}
              <span className="cnt">{counts[t]}</span>
            </Link>
          ))}
        </nav>
      </header>
      <div className="wrap">{children}</div>
    </div>
  );
}
