"use server";

import { sql } from "./db";
import { ASSET_TYPES, isAssetType } from "./types";
import type { AssetRecord, AssetType } from "./types";

/**
 * Server actions — ขอบเขต server/client ของระบบ
 * client (NeonStore ใน lib/data.ts) เรียกฟังก์ชันเหล่านี้; ตัว query จริงรันบน server
 * ทุกฟังก์ชัน validate type กัน input แปลกจาก client
 */

function assertType(type: string): asserts type is AssetType {
  if (!isAssetType(type)) throw new Error(`ประเภทครุภัณฑ์ไม่ถูกต้อง: ${type}`);
}

/** map แถวจากฐานข้อมูลเป็น AssetRecord (id → _id, กระจาย data) */
function toRecord(row: { id: string; data: Record<string, string> }): AssetRecord {
  return { ...row.data, _id: row.id };
}

export async function listAssets(type: string): Promise<AssetRecord[]> {
  assertType(type);
  const rows = (await sql`
    select id::text as id, data
    from assets
    where type = ${type}
    order by created_at asc
  `) as { id: string; data: Record<string, string> }[];
  return rows.map(toRecord);
}

/** จำนวนครุภัณฑ์ต่อ type — query เดียว (count) แทนดึงเต็มแถว 4 ครั้ง */
export async function getCounts(): Promise<Record<AssetType, number>> {
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
}

/** ดึงครุภัณฑ์ทุก type ใน query เดียว (สำหรับหน้า dashboard) */
export async function listAll(): Promise<Record<AssetType, AssetRecord[]>> {
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
}

export async function insertAsset(
  type: string,
  data: Record<string, string>,
): Promise<AssetRecord> {
  assertType(type);
  const rows = (await sql`
    insert into assets (type, data)
    values (${type}, ${JSON.stringify(data)}::jsonb)
    returning id::text as id, data
  `) as { id: string; data: Record<string, string> }[];
  return toRecord(rows[0]);
}

export async function updateAsset(
  type: string,
  id: string,
  data: Record<string, string>,
): Promise<void> {
  assertType(type);
  await sql`
    update assets
    set data = ${JSON.stringify(data)}::jsonb
    where id = ${id} and type = ${type}
  `;
}

export async function removeAsset(type: string, id: string): Promise<void> {
  assertType(type);
  await sql`
    delete from assets
    where id = ${id} and type = ${type}
  `;
}
