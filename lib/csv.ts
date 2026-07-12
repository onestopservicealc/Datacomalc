import { SCHEMA } from "./schema";
import type { AssetRecord, AssetType } from "./types";

/** ดาวน์โหลดข้อมูลเป็น CSV (มี BOM ให้ Excel เปิดภาษาไทยไม่เพี้ยน) */
export function exportCSV(type: AssetType, rows: AssetRecord[]) {
  const fields = SCHEMA[type].sections.flatMap((s) => s.fields);
  const quote = (s: unknown) =>
    '"' + String(s ?? "").replace(/"/g, '""') + '"';

  let csv = "﻿" + fields.map((f) => quote(f.label)).join(",") + "\n";
  for (const r of rows) {
    csv += fields.map((f) => quote(r[f.key])).join(",") + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${type}_export.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
