// Seed Neon Postgres จาก lib/seed-data.json (รันครั้งเดียว)
// รัน:  node --env-file=.env.local scripts/seed-neon.mjs
//
// idempotent: ถ้าตาราง assets มีข้อมูลอยู่แล้วจะข้าม (ไม่ seed ซ้ำ)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const ASSET_TYPES = ["pc", "notebook", "ups", "printer"];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ไม่พบ DATABASE_URL — รันด้วย: node --env-file=.env.local scripts/seed-neon.mjs");
  process.exit(1);
}
const sql = neon(url);

const here = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(here, "..", "lib", "seed-data.json"), "utf8"));

async function main() {
  // 1) สร้างตาราง
  await sql`
    create table if not exists assets (
      id         uuid primary key default gen_random_uuid(),
      type       text not null,
      data       jsonb not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists assets_type_idx on assets(type)`;
  console.log("✓ ตาราง assets พร้อม");

  // 2) กัน seed ซ้ำ
  const [{ count }] = await sql`select count(*)::int as count from assets`;
  if (count > 0) {
    console.log(`ตารางมีข้อมูล ${count} แถวอยู่แล้ว — ข้าม seed (ลบข้อมูลก่อนถ้าต้องการ seed ใหม่)`);
    return;
  }

  // 3) insert ต่อ type (ตัด key 'seq' ออก — ไม่ได้ใช้ใน schema)
  let total = 0;
  for (const type of ASSET_TYPES) {
    const rows = Array.isArray(seed[type]) ? seed[type] : [];
    let n = 0;
    for (const raw of rows) {
      const { seq, ...data } = raw; // eslint-disable-line no-unused-vars
      await sql`insert into assets (type, data) values (${type}, ${JSON.stringify(data)}::jsonb)`;
      n++;
    }
    total += n;
    console.log(`  ${type}: seed ${n} แถว`);
  }
  console.log(`✓ seed รวม ${total} แถว`);
}

main().catch((e) => {
  console.error("seed ล้มเหลว:", e);
  process.exit(1);
});
