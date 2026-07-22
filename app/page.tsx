import Link from "next/link";
import { GROUPS, NETWORK_INFO, SCHEMA } from "@/lib/schema";
import { ASSET_TYPES } from "@/lib/types";
import { getCounts, getDashboardStats } from "@/lib/queries";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

/** ภาพรวม — Server Component: สถิติคำนวณใน SQL (cache) ไม่ดึงทุกแถวมานับใน JS */
export default async function DashboardPage() {
  const [counts, stats] = await Promise.all([getCounts(), getDashboardStats()]);

  const total = ASSET_TYPES.reduce((a, t) => a + counts[t], 0);
  const w10 = stats.win10;

  const groupCount = stats.groupCount;
  const gmax = Math.max(1, ...GROUPS.map((g) => groupCount[g] ?? 0));

  const brands = stats.brands;
  const bmax = Math.max(1, ...brands.map(([, n]) => n));

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="hero">
          <div className="hero-k">ครุภัณฑ์ไอทีทั้งหมด</div>
          <div className="hero-v">{total}</div>
          <div className="hero-sub">คอมพิวเตอร์ · โน้ตบุ๊ก · UPS · Printer</div>
        </div>
        <div className="dash-right">
          {w10 > 0 && (
            <div className="alert">
              <span className="alert-ic">
                <Icon name="alert-triangle" />
              </span>
              <div className="alert-body">
                <b>Windows 10 ค้างอยู่ {w10} เครื่อง</b>
                <p>
                  หมดระยะสนับสนุนด้านความปลอดภัยแล้ว —
                  ควรวางแผนอัปเกรดเป็น Windows 11
                </p>
              </div>
              <Link className="alert-act" href="/pc">
                ดูรายการ
              </Link>
            </div>
          )}
          <div className="mini-stats">
            {ASSET_TYPES.map((t) => (
              <div className="mini" key={t}>
                <div className="k">
                  <Icon name={SCHEMA[t].icon} /> {SCHEMA[t].label}
                </div>
                <div className="v">{counts[t]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="block">
          <h3>
            <Icon name="users-group" /> คอมพิวเตอร์แยกตามกลุ่มงาน
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
                    width: `${Math.round(((groupCount[g] ?? 0) / gmax) * 100)}%`,
                    background: "var(--ink)",
                  }}
                ></div>
              </div>
              <span className="num">{groupCount[g] ?? 0}</span>
            </div>
          ))}
        </div>
        <div className="block">
          <h3>
            <Icon name="tag" /> ยี่ห้อคอมพิวเตอร์
          </h3>
          {brands.map(([b, n]) => (
            <div className="bar-row" key={b}>
              <span className="lab" title={b}>
                {b}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.round((n / bmax) * 100)}%` }}
                ></div>
              </div>
              <span className="num">{n}</span>
            </div>
          ))}
          <div className="net">
            <div className="net-t">ค่าเครือข่ายหน่วยงาน</div>
            {NETWORK_INFO.map((line) => (
              <div className="net-line" key={line}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
