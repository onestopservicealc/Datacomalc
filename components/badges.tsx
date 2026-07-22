import Icon from "./Icon";

/** ป้ายสถานะ Windows: 11 = เทากลาง, 10 = แดงเตือน (หมดระยะสนับสนุน ต้องอัปเกรด) */
export function OsBadge({ value }: { value?: string }) {
  const s = (value || "").trim();
  if (!s || s === "-") return <span className="badge na">ไม่ระบุ</span>;
  if (s.startsWith("11")) return <span className="badge win11">Win {s}</span>;
  if (s.startsWith("10"))
    return (
      <span className="badge win10">
        <Icon name="alert-triangle" />Win {s}
      </span>
    );
  return <span className="badge na">{s}</span>;
}

/** กลุ่มงานที่ขึ้นต้นด้วย !!! คือสถานะพิเศษ (เก็บอยู่ห้องเก็บของ ฯลฯ) แสดงเป็นป้าย */
export function GroupCell({ value }: { value?: string }) {
  const s = (value || "").trim();
  if (s.startsWith("!!!"))
    return <span className="badge store">{s.replace(/!/g, "").trim()}</span>;
  if (!s) return <span className="muted">—</span>;
  return <>{s}</>;
}

/** ค่าทั่วไปในตาราง: ว่าง/ขีด แสดงเป็น — จาง ๆ */
export function PlainCell({ value }: { value?: string }) {
  const s = (value || "").trim();
  if (!s || s === "-") return <span className="muted">—</span>;
  return <>{s}</>;
}
