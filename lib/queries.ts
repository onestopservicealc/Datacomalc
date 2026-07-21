import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "./db";
import { ASSET_TYPES, isAssetType } from "./types";
import type { AssetRecord, AssetType } from "./types";

/**
 * การอ่านข้อมูลแบบ cache (Server Components เท่านั้น)
 * ผล query ถูกเก็บใน Data Cache ใต้ tag เดียว (ASSETS_TAG) — ใช้ซ้ำข้ามทุก request
 * ไม่ยิง Neon ใหม่ทุกครั้ง (แก้อาการช้า/cold start) จนกว่าจะมี mutation เรียก revalidateTag
 * mutation ทั้งหมดอยู่ใน lib/actions.ts และ revalidateTag(ASSETS_TAG) หลังเขียนเสมอ
 */
export const ASSETS_TAG = "assets";

/** map แถวจากฐานข้อมูลเป็น AssetRecord (id → _id, กระจาย data) */
function toRecord(row: { id: string; data: Record<string, string> }): AssetRecord {
  return { ...row.data, _id: row.id };
}

/** ครุภัณฑ์ตาม type — cache ต่อ type (arg เป็นส่วนหนึ่งของ cache key) */
export const listAssets = unstable_cache(
  async (type: AssetType): Promise<AssetRecord[]> => {
    const rows = (await sql`
      select id::text as id, data
      from assets
      where type = ${type}
      order by created_at asc
    `) as { id: string; data: Record<string, string> }[];
    return rows.map(toRecord);
  },
  ["assets-by-type"],
  { tags: [ASSETS_TAG] },
);

/** จำนวนครุภัณฑ์ต่อ type — query เดียว (count) */
export const getCounts = unstable_cache(
  async (): Promise<Record<AssetType, number>> => {
    const rows = (await sql`
      select type, count(*)::int as n from assets group by type
    `) as { type: string; n: number }[];
    const counts = Object.fromEntries(
      ASSET_TYPES.map((t) => [t, 0]),
    ) as Record<AssetType, number>;
    for (const r of rows) {
      if (isAssetType(r.type)) counts[r.type] = r.n;
    }
    return counts;
  },
  ["assets-counts"],
  { tags: [ASSETS_TAG] },
);

/** ครุภัณฑ์ทุก type ใน query เดียว (หน้า dashboard) */
export const listAll = unstable_cache(
  async (): Promise<Record<AssetType, AssetRecord[]>> => {
    const rows = (await sql`
      select id::text as id, type, data
      from assets
      order by created_at asc
    `) as { id: string; type: string; data: Record<string, string> }[];
    const out = Object.fromEntries(
      ASSET_TYPES.map((t) => [t, [] as AssetRecord[]]),
    ) as Record<AssetType, AssetRecord[]>;
    for (const r of rows) {
      if (isAssetType(r.type)) out[r.type].push(toRecord(r));
    }
    return out;
  },
  ["assets-all"],
  { tags: [ASSETS_TAG] },
);

/** สถิติหน้า dashboard — คำนวณใน SQL (ไม่ดึง jsonb ทุกแถวมานับใน JS) */
export const getDashboardStats = unstable_cache(
  async () => {
    const [win, groups, brands] = (await Promise.all([
      // เครื่องที่ยังใช้ Windows 10 (pc + notebook) — นับใน SQL
      sql`
        select count(*)::int as n from assets
        where type in ('pc','notebook') and trim(data->>'os') like '10%'
      `,
      // pc แยกตามกลุ่มงาน
      sql`
        select coalesce(nullif(trim(data->>'group'), ''), '') as g, count(*)::int as n
        from assets where type = 'pc' group by g
      `,
      // ยี่ห้อ pc ยอดนิยม 6 อันดับ
      sql`
        select coalesce(nullif(trim(data->>'brand'), ''), 'ไม่ระบุ') as b, count(*)::int as n
        from assets where type = 'pc' group by b order by n desc limit 6
      `,
    ])) as unknown as [
      { n: number }[],
      { g: string; n: number }[],
      { b: string; n: number }[],
    ];
    return {
      win10: win[0]?.n ?? 0,
      groupCount: Object.fromEntries(groups.map((r) => [r.g, r.n])) as Record<string, number>,
      brands: brands.map((r) => [r.b, r.n] as [string, number]),
    };
  },
  ["assets-dashboard-stats"],
  { tags: [ASSETS_TAG] },
);
