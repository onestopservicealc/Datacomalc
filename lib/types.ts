export const ASSET_TYPES = ["pc", "notebook", "ups", "printer"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export function isAssetType(v: string): v is AssetType {
  return (ASSET_TYPES as readonly string[]).includes(v);
}

/** หนึ่งรายการครุภัณฑ์ — ฟิลด์ทั้งหมดเป็น string ตาม schema ของแต่ละประเภท */
export type AssetRecord = { _id: string } & Record<string, string>;
