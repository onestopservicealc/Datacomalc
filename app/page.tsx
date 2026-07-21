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
    <div className="panel">
      {w10 > 0 && (
        <div className="alert">
          <Icon name="alert-triangle" />
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
            <Icon name="stack-2" /> ครุภัณฑ์ทั้งหมด
          </div>
          <div className="v">{total}</div>
        </div>
        {ASSET_TYPES.map((t) => (
          <div className="stat" key={t}>
            <div className="k">
              <Icon name={SCHEMA[t].icon} /> {SCHEMA[t].label}
            </div>
            <div className="v">{counts[t]}</div>
          </div>
        ))}
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
          <Icon name="network" /> ค่าเครือข่าย (IP / Gateway / DNS)
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
