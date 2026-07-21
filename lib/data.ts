import type { AssetRecord, AssetType } from "./types";
import {
  insertAsset,
  listAssets,
  removeAsset,
  updateAsset,
} from "./actions";

/**
 * ชั้นข้อมูลของระบบ — ทุกหน้าคุยกับ DataStore เท่านั้น
 * ใช้ NeonStore (ข้อมูลกลางบน Neon Postgres ผ่าน server actions ใน lib/actions.ts)
 */
export interface DataStore {
  /** ชนิดของ backend — ใช้แสดงสถานะบน header */
  readonly kind: "local" | "supabase" | "neon";
  list(type: AssetType): Promise<AssetRecord[]>;
  insert(type: AssetType, data: Record<string, string>): Promise<AssetRecord>;
  update(type: AssetType, id: string, data: Record<string, string>): Promise<void>;
  remove(type: AssetType, id: string): Promise<void>;
}

/** เก็บข้อมูลบน Neon Postgres — เรียกผ่าน server actions (connection string อยู่ฝั่ง server) */
class NeonStore implements DataStore {
  readonly kind = "neon" as const;

  list(type: AssetType) {
    return listAssets(type);
  }

  insert(type: AssetType, data: Record<string, string>) {
    return insertAsset(type, data);
  }

  update(type: AssetType, id: string, data: Record<string, string>) {
    return updateAsset(type, id, data);
  }

  remove(type: AssetType, id: string) {
    return removeAsset(type, id);
  }
}

let store: DataStore | null = null;

export function getStore(): DataStore {
  if (!store) store = new NeonStore();
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
