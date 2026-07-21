"use server";

import { updateTag } from "next/cache";
import { sql } from "./db";
import { isAssetType } from "./types";
import type { AssetRecord, AssetType } from "./types";
import {
  ASSETS_TAG,
  getCounts as getCountsCached,
  listAssets as listAssetsCached,
} from "./queries";

/**
 * Server actions — ขอบเขต server/client ของระบบ
 * - อ่าน (refetch*) : client เรียกหลัง mutation → อ่านจาก Data Cache (lib/queries.ts)
 * - เขียน (insert/update/remove) : เขียน Neon แล้ว updateTag(ASSETS_TAG) ล้าง cache (read-your-own-writes)
 * Server Components อ่านตรงจาก lib/queries.ts (ไม่ผ่าน action)
 */

function assertType(type: string): asserts type is AssetType {
  if (!isAssetType(type)) throw new Error(`ประเภทครุภัณฑ์ไม่ถูกต้อง: ${type}`);
}

/** client (AssetTable.reload) เรียกหลังเพิ่ม/แก้/ลบ — cache เพิ่ง revalidate จึงได้ข้อมูลใหม่ */
export async function refetchAssets(type: string): Promise<AssetRecord[]> {
  assertType(type);
  return listAssetsCached(type);
}

/** client (AppShell) เรียกหลังข้อมูลเปลี่ยน เพื่ออัปเดตตัวเลขบนแท็บ */
export async function refetchCounts(): Promise<Record<AssetType, number>> {
  return getCountsCached();
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
  updateTag(ASSETS_TAG);
  const row = rows[0];
  return { ...row.data, _id: row.id };
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
  updateTag(ASSETS_TAG);
}

export async function removeAsset(type: string, id: string): Promise<void> {
  assertType(type);
  await sql`
    delete from assets
    where id = ${id} and type = ${type}
  `;
  updateTag(ASSETS_TAG);
}
