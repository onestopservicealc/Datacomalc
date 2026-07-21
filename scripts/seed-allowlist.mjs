// สร้างตาราง allowed_emails + seed อีเมลเริ่มต้น (รันครั้งเดียว)
// รัน:  node --env-file=.env.local scripts/seed-allowlist.mjs

import { neon } from "@neondatabase/serverless";

const SEED = ["webex.alc@ddc.mail.go.th", "chakhrit.ket@gmail.com"];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ไม่พบ DATABASE_URL — รันด้วย: node --env-file=.env.local scripts/seed-allowlist.mjs");
  process.exit(1);
}
const sql = neon(url);

async function main() {
  await sql`
    create table if not exists allowed_emails (
      email      text primary key,
      added_at   timestamptz not null default now(),
      added_by   text
    )
  `;
  console.log("✓ ตาราง allowed_emails พร้อม");

  for (const raw of SEED) {
    const email = raw.toLowerCase();
    await sql`
      insert into allowed_emails (email, added_by)
      values (${email}, ${"seed"})
      on conflict (email) do nothing
    `;
    console.log(`  + ${email}`);
  }

  const rows = await sql`select email from allowed_emails order by added_at`;
  console.log(`✓ รวม ${rows.length} อีเมล:`, rows.map((r) => r.email).join(", "));
}

main().catch((e) => {
  console.error("seed ล้มเหลว:", e);
  process.exit(1);
});
