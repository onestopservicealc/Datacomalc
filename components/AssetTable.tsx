"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { MONO_KEYS, SCHEMA } from "@/lib/schema";
import type { AssetRecord, AssetType } from "@/lib/types";
import { distinctValues, getStore, notifyDataChanged } from "@/lib/data";
import { exportCSV } from "@/lib/csv";
import { GroupCell, OsBadge, PlainCell } from "./badges";
import RecordModal from "./RecordModal";
import { Toast, useToast } from "./Toast";
import Icon from "./Icon";

export default function AssetTable({
  type,
  initial,
}: {
  type: AssetType;
  initial: AssetRecord[];
}) {
  const sc = SCHEMA[type];
  // seed จากข้อมูลที่ server ส่งมา — ไม่ fetch ตอน mount (ไม่มี spinner)
  const [records, setRecords] = useState<AssetRecord[]>(initial);
  const [search, setSearch] = useState("");
  // ให้ช่องค้นหาตอบสนองทันที แต่หน่วงการกรองตาราง (ไม่กระตุกเมื่อข้อมูลเยอะ)
  const deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState("");
  // modal: undefined = ปิด, null = เพิ่มใหม่, record = แก้ไข
  const [editing, setEditing] = useState<AssetRecord | null | undefined>(
    undefined,
  );
  const { toast, show } = useToast();

  // reload เรียกเฉพาะหลัง insert/update/delete (ไม่ใช่ตอน mount)
  const reload = useCallback(async () => {
    try {
      setRecords(await getStore().list(type));
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", err);
      show("โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้า", true);
    }
  }, [type, show]);

  const groupOptions = useMemo(
    () => distinctValues(records, sc.groupField),
    [records, sc.groupField],
  );

  const rows = useMemo(() => {
    let r = records;
    if (filter) r = r.filter((x) => (x[sc.groupField] || "") === filter);
    if (deferredSearch) {
      const q = deferredSearch.toLowerCase();
      r = r.filter((x) =>
        Object.values(x).some((v) =>
          String(v || "").toLowerCase().includes(q),
        ),
      );
    }
    return r;
  }, [records, filter, deferredSearch, sc.groupField]);

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
          <Icon name="search" className="ic" />
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
          <Icon name="download" /> Export CSV
        </button>
        <button className="btn primary" onClick={() => setEditing(null)}>
          <Icon name="plus" /> เพิ่ม{sc.singular}
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
                      <Icon name="inbox" />
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
                        <button
                          type="button"
                          className="iconbtn"
                          title="แก้ไข"
                          aria-label="แก้ไขรายการ"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(r);
                          }}
                        >
                          <Icon name="edit" />
                        </button>
                        <button
                          type="button"
                          className="iconbtn del"
                          title="ลบ"
                          aria-label="ลบรายการ"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecord(r._id);
                          }}
                        >
                          <Icon name="trash" />
                        </button>
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
