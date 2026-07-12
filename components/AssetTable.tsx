"use client";

import { useCallback, useEffect, useState } from "react";
import { MONO_KEYS, SCHEMA } from "@/lib/schema";
import type { AssetRecord, AssetType } from "@/lib/types";
import { distinctValues, getStore, notifyDataChanged } from "@/lib/data";
import { exportCSV } from "@/lib/csv";
import { GroupCell, OsBadge, PlainCell } from "./badges";
import RecordModal from "./RecordModal";
import { Toast, useToast } from "./Toast";

export default function AssetTable({ type }: { type: AssetType }) {
  const sc = SCHEMA[type];
  const [records, setRecords] = useState<AssetRecord[] | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  // modal: undefined = ปิด, null = เพิ่มใหม่, record = แก้ไข
  const [editing, setEditing] = useState<AssetRecord | null | undefined>(
    undefined,
  );
  const { toast, show } = useToast();

  const reload = useCallback(async () => {
    setRecords(await getStore().list(type));
  }, [type]);

  useEffect(() => {
    // โหลดข้อมูลตอน mount — DataStore เป็น async (เตรียมไว้สำหรับ Supabase) setState จึงไม่ synchronous จริง
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  if (!records) {
    return (
      <div className="panel">
        <div className="loading">
          <div className="spin"></div>กำลังโหลดข้อมูล…
        </div>
      </div>
    );
  }

  const groupOptions = distinctValues(records, sc.groupField);

  let rows = records;
  if (filter) rows = rows.filter((r) => (r[sc.groupField] || "") === filter);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((r) =>
      Object.values(r).some((v) => String(v || "").toLowerCase().includes(q)),
    );
  }

  async function saveRecord(data: Record<string, string>) {
    const store = getStore();
    if (editing) {
      await store.update(type, editing._id, data);
      show("บันทึกการแก้ไขแล้ว");
    } else {
      await store.insert(type, data);
      show("เพิ่มรายการแล้ว");
    }
    setEditing(undefined);
    await reload();
    notifyDataChanged();
  }

  async function deleteRecord(id: string) {
    if (!confirm("ต้องการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถกู้คืนได้"))
      return;
    await getStore().remove(type, id);
    show("ลบรายการแล้ว");
    setEditing(undefined);
    await reload();
    notifyDataChanged();
  }

  const filterLabel = sc.groupField === "building" ? "ทุกอาคาร" : "ทุกกลุ่มงาน";

  return (
    <div className="panel">
      <div className="toolbar">
        <div className="search">
          <i className="ti ti-search ic"></i>
          <input
            placeholder={`ค้นหา ${sc.singular}… (ชื่อ, เลขครุภัณฑ์, IP, รุ่น ฯลฯ)`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{filterLabel}</option>
          {groupOptions.map((o) => (
            <option key={o} value={o}>
              {o.replace(/!/g, "").trim()}
            </option>
          ))}
        </select>
        <button className="btn" onClick={() => exportCSV(type, records)}>
          <i className="ti ti-download"></i> Export CSV
        </button>
        <button className="btn primary" onClick={() => setEditing(null)}>
          <i className="ti ti-plus"></i> เพิ่ม{sc.singular}
        </button>
      </div>

      <div className="card">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                {sc.tableCols.map(([key, label]) => (
                  <th key={key} className={MONO_KEYS.has(key) ? "mono" : ""}>
                    {label}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={sc.tableCols.length + 1}>
                    <div className="empty">
                      <i className="ti ti-inbox"></i>
                      {search || filter
                        ? "ไม่พบรายการที่ตรงกับเงื่อนไข"
                        : "ยังไม่มีรายการ กด “เพิ่ม” เพื่อเริ่มบันทึก"}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} onClick={() => setEditing(r)}>
                    {sc.tableCols.map(([key]) => (
                      <td
                        key={key}
                        className={MONO_KEYS.has(key) ? "mono" : ""}
                      >
                        {key === "os" ? (
                          <OsBadge value={r[key]} />
                        ) : key === "group" ? (
                          <GroupCell value={r[key]} />
                        ) : (
                          <PlainCell value={r[key]} />
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="rowact">
                        <div
                          className="iconbtn"
                          title="แก้ไข"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(r);
                          }}
                        >
                          <i className="ti ti-edit"></i>
                        </div>
                        <div
                          className="iconbtn del"
                          title="ลบ"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecord(r._id);
                          }}
                        >
                          <i className="ti ti-trash"></i>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="count-note">
        แสดง {rows.length} จาก {records.length} รายการ
      </p>

      {editing !== undefined && (
        <RecordModal
          type={type}
          record={editing}
          records={records}
          onSave={saveRecord}
          onDelete={editing ? () => deleteRecord(editing._id) : undefined}
          onClose={() => setEditing(undefined)}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}
