import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Neon Postgres client (server เท่านั้น — ห้าม import จาก client component)
 * ใช้ DATABASE_URL ใน .env.local (connection string ที่มี password — ไม่ commit)
 */
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "ไม่พบ DATABASE_URL — ตั้งค่าใน .env.local (ดู README/plan). ระบบต้องใช้ Neon connection string",
  );
}

export const sql = neon(url);
