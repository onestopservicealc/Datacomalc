"use client";

import { useEffect, useState } from "react";
import { GROUPS, NETWORK_INFO, SCHEMA } from "@/lib/schema";
import { ASSET_TYPES, type AssetRecord, type AssetType } from "@/lib/types";
import { getStore } from "@/lib/data";

type AllData = Record<AssetType, AssetRecord[]>;

export default function DashboardPage() {
  const [data, setData] = useState<AllData | null>(null);

  useEffect(() => {
    (async () => {
      const store = getStore();
      const entries = await Promise.all(
        ASSET_TYPES.map(async (t) => [t, await store.list(t)] as const),
      );
      setData(Object.fromEntries(entries) as AllData);
    })();
  }, []);

  if (!data) {
    return (
      <div className="panel">
        <div className="loading">
          <div className="spin"></div>กำลังโหลดข้อมูล…
        </div>
      </div>
    );
  }

  const total = ASSET_TYPES.reduce((a, t) => a + data[t].length, 0);
  const win10 = (t: AssetType) =>
    data[t].filter((r) => (r.os || "").trim().startsWith("10")).length;
  const w10 = win10("pc") + win10("notebook");

  const groupCount: Record<string, number> = {};
  for (const g of GROUPS) groupCount[g] = 0;
  for (const r of data.pc) {
    const g = (r.group || "").trim();
    if (g in groupCount) groupCount[g]++;
  }
  const gmax = Math.max(1, ...Object.values(groupCount));

  const brandCount: Record<string, number> = {};
  for (const r of data.pc) {
    const b = (r.brand || "").trim() || "ไม่ระบุ";
    brandCount[b] = (brandCount[b] || 0) + 1;
  }
  const brands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const bmax = Math.max(1, ...brands.map(([, n]) => n));

  return (
    <div className="panel">
      {w10 > 0 && (
        <div className="alert">
          <i className="ti ti-alert-triangle"></i>
          <div>
            <b>มีเครื่องที่ยังใช้ Windows 10 อยู่ {w10} เครื่อง</b>
            <p>
              Windows 10 สิ้นสุดการสนับสนุนด้านความปลอดภัยแล้ว
              ควรวางแผนอัปเกรดเป็น Windows 11 เพื่อลดความเสี่ยง —
              กรองดูได้ในแท็บคอมพิวเตอร์และโน้ตบุ๊ก
            </p>
          </div>
        </div>
      )}

      <div className="stats">
        <div className="stat">
          <div className="k">
            <i className="ti ti-stack-2"></i> ครุภัณฑ์ทั้งหมด
          </div>
          <div className="v">{total}</div>
        </div>
        {ASSET_TYPES.map((t) => (
          <div className="stat" key={t}>
            <div className="k">
              <i className={`ti ${SCHEMA[t].icon}`}></i> {SCHEMA[t].label}
            </div>
            <div className="v">{data[t].length}</div>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="block">
          <h3>
            <i className="ti ti-users-group"></i> คอมพิวเตอร์แยกตามกลุ่มงาน
          </h3>
          {GROUPS.map((g) => (
            <div className="bar-row" key={g}>
              <span className="lab" title={g}>
                {g}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.round((groupCount[g] / gmax) * 100)}%`,
                  }}
                ></div>
              </div>
              <span className="num">{groupCount[g]}</span>
            </div>
          ))}
        </div>
        <div className="block">
          <h3>
            <i className="ti ti-tag"></i> ยี่ห้อคอมพิวเตอร์
          </h3>
          {brands.map(([b, n]) => (
            <div className="bar-row" key={b}>
              <span className="lab" title={b}>
                {b}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.round((n / bmax) * 100)}%`,
                    background: "#0E7C57",
                  }}
                ></div>
              </div>
              <span className="num">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="block" style={{ marginTop: 12 }}>
        <h3>
          <i className="ti ti-network"></i> ค่าเครือข่าย (IP / Gateway / DNS)
        </h3>
        {NETWORK_INFO.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--fs-xs)",
              color: "var(--ink-2)",
              padding: "4px 0",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
