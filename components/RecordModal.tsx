"use client";

import { useEffect, useState } from "react";
import {
  GROUPS,
  MONO_KEYS,
  OS_OPTS,
  PREFIX_OPTS,
  SCHEMA,
  type FieldDef,
} from "@/lib/schema";
import type { AssetRecord, AssetType } from "@/lib/types";
import { distinctValues } from "@/lib/data";
import Icon from "./Icon";

type Props = {
  type: AssetType;
  /** null = เพิ่มรายการใหม่ */
  record: AssetRecord | null;
  /** รายการทั้งหมด — ใช้สร้างตัวเลือก datalist (ยี่ห้อ/ประเภท ที่เคยกรอก) */
  records: AssetRecord[];
  onSave: (data: Record<string, string>) => void;
  onDelete?: () => void;
  onClose: () => void;
};

export default function RecordModal({
  type,
  record,
  records,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const sc = SCHEMA[type];
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const s of sc.sections)
      for (const f of s.fields) init[f.key] = record?.[f.key] ?? "";
    return init;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function datalistOptions(f: FieldDef): string[] {
    const src = f.input!.slice("datalist:".length);
    if (src === "group") return GROUPS;
    if (src === "os") return OS_OPTS;
    if (src === "prefix") return PREFIX_OPTS;
    return distinctValues(records, f.key);
  }

  function renderField(f: FieldDef) {
    const value = form[f.key] ?? "";
    const set = (v: string) => setForm((prev) => ({ ...prev, [f.key]: v }));
    const mono = MONO_KEYS.has(f.key) ? "mono-in" : "";
    const id = `f_${f.key}`;

    let control: React.ReactNode;
    if (f.input?.startsWith("select:")) {
      const opts = f.input.slice("select:".length).split(",");
      control = (
        <select id={id} value={value} onChange={(e) => set(e.target.value)}>
          <option value=""></option>
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    } else if (f.input?.startsWith("datalist:")) {
      const listId = `dl_${f.key}`;
      control = (
        <>
          <input
            id={id}
            className={mono}
            list={listId}
            value={value}
            onChange={(e) => set(e.target.value)}
          />
          <datalist id={listId}>
            {datalistOptions(f).map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      );
    } else {
      control = (
        <input
          id={id}
          className={mono}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      );
    }

    return (
      <div key={f.key} className={`field${f.full ? " full" : ""}`}>
        <label htmlFor={id}>{f.label}</label>
        {control}
      </div>
    );
  }

  function save() {
    const data: Record<string, string> = {};
    for (const [k, v] of Object.entries(form)) data[k] = v.trim();
    onSave(data);
  }

  return (
    <div
      className="overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-h">
          <h2>{record ? "แก้ไข" : "เพิ่ม"}{sc.singular}</h2>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-b">
          {sc.sections.map((s) => (
            <div key={s.title}>
              <div className="fsec">{s.title}</div>
              <div className="fgrid">{s.fields.map(renderField)}</div>
            </div>
          ))}
        </div>
        <div className="modal-f">
          {record && onDelete ? (
            <button className="btn ghost del" onClick={onDelete}>
              <Icon name="trash" /> ลบรายการนี้
            </button>
          ) : (
            <span></span>
          )}
          <div className="right">
            <button className="btn" onClick={onClose}>
              ยกเลิก
            </button>
            <button className="btn primary" onClick={save}>
              <Icon name="check" /> บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
