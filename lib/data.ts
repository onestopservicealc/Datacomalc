import type { AssetRecord, AssetType } from "./types";
import seedData from "./seed-data.json";

/**
 * ชั้นข้อมูลของระบบ — ทุกหน้าคุยกับ DataStore เท่านั้น
 * ตอนนี้ใช้ LocalStorageStore (ข้อมูลอยู่ในเบราว์เซอร์เครื่องนั้น ๆ)
 * เมื่อพร้อมเชื่อม Supabase ให้เพิ่ม SupabaseStore ที่ implement interface เดียวกัน
 * แล้วสลับใน getStore() ตาม NEXT_PUBLIC_SUPABASE_URL
 */
export interface DataStore {
  /** ชนิดของ backend — ใช้แสดงสถานะบน header */
  readonly kind: "local" | "supabase";
  list(type: AssetType): Promise<AssetRecord[]>;
  insert(type: AssetType, data: Record<string, string>): Promise<AssetRecord>;
  update(type: AssetType, id: string, data: Record<string, string>): Promise<void>;
  remove(type: AssetType, id: string): Promise<void>;
}

const keyFor = (t: AssetType) => `${t}_records_v1`;

function uid(t: AssetType) {
  return `${t}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

class LocalStorageStore implements DataStore {
  readonly kind = "local" as const;

  private read(t: AssetType): AssetRecord[] {
    const raw = window.localStorage.getItem(keyFor(t));
    if (raw) {
      try {
        return JSON.parse(raw) as AssetRecord[];
      } catch {
        /* ข้อมูลเสีย — seed ใหม่ด้านล่าง */
      }
    }
    const seeded = (
      (seedData as unknown as Record<string, Record<string, string>[]>)[t] ??
      []
    ).map((rec, i) => ({ _id: `${t}_seed_${i}`, ...rec }));
    window.localStorage.setItem(keyFor(t), JSON.stringify(seeded));
    return seeded;
  }

  private write(t: AssetType, rows: AssetRecord[]) {
    window.localStorage.setItem(keyFor(t), JSON.stringify(rows));
  }

  async list(t: AssetType) {
    return this.read(t);
  }

  async insert(t: AssetType, data: Record<string, string>) {
    const rec: AssetRecord = { _id: uid(t), ...data };
    this.write(t, [rec, ...this.read(t)]);
    return rec;
  }

  async update(t: AssetType, id: string, data: Record<string, string>) {
    this.write(
      t,
      this.read(t).map((r) => (r._id === id ? { ...r, ...data, _id: id } : r)),
    );
  }

  async remove(t: AssetType, id: string) {
    this.write(
      t,
      this.read(t).filter((r) => r._id !== id),
    );
  }
}

let store: DataStore | null = null;

export function getStore(): DataStore {
  if (!store) store = new LocalStorageStore();
  return store;
}

/** แจ้งทุกส่วนของแอป (เช่น ตัวเลขบนแท็บ) ว่าข้อมูลเปลี่ยน */
export const DATA_CHANGED_EVENT = "datacomalc:changed";
export function notifyDataChanged() {
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

/** ค่าที่ไม่ซ้ำของฟิลด์หนึ่ง ๆ ใช้ทำ dropdown กรองและ datalist */
export function distinctValues(rows: AssetRecord[], key: string): string[] {
  const s = new Set<string>();
  for (const r of rows) {
    const v = (r[key] || "").trim();
    if (v && v !== "-") s.add(v);
  }
  return [...s].sort((a, b) => a.localeCompare(b, "th"));
}
