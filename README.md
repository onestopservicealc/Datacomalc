# ทะเบียนครุภัณฑ์คอมพิวเตอร์ สคอ.

ระบบจัดเก็บและค้นหาข้อมูลครุภัณฑ์ไอที (คอมพิวเตอร์ / โน้ตบุ๊ก / UPS / Printer-Scanner)
สร้างด้วย **Next.js (App Router)** — พัฒนาต่อจาก prototype ใน `prototype/original.html`

## ฟีเจอร์

- **ภาพรวม (Dashboard)** — จำนวนครุภัณฑ์ทั้งหมด, แจ้งเตือนเครื่องที่ยังใช้ Windows 10, กราฟแยกตามกลุ่มงาน/ยี่ห้อ, ค่าเครือข่ายของหน่วยงาน
- **ตารางครุภัณฑ์ 4 ประเภท** — ค้นหาทุกฟิลด์, กรองตามกลุ่มงาน/อาคาร, เพิ่ม/แก้ไข/ลบผ่านฟอร์ม
- **Export CSV** — เปิดใน Excel ได้ ภาษาไทยไม่เพี้ยน (มี BOM)

## การรันบนเครื่อง

```bash
npm install
npm run dev     # เปิด http://localhost:3000
```

## ที่เก็บข้อมูล (สำคัญ)

ตอนนี้ข้อมูลถูกเก็บใน **localStorage ของเบราว์เซอร์** (seed ครั้งแรกจาก `lib/seed-data.json`)

- ข้อมูลที่แก้ไขจะอยู่เฉพาะเบราว์เซอร์/เครื่องนั้น — คนละเครื่องมองไม่เห็นกัน
- ล้างข้อมูลเว็บไซต์ = ข้อมูลที่แก้ไว้หาย (กลับเป็นค่า seed)
- เหมาะสำหรับทดลองใช้/พัฒนา ก่อนเชื่อมฐานข้อมูลจริง

### แผนการเชื่อม Supabase (ขั้นถัดไป)

โค้ดถูกออกแบบให้สลับ backend ได้ที่จุดเดียว — ทุกหน้าเรียกข้อมูลผ่าน interface `DataStore` ใน [lib/data.ts](lib/data.ts):

1. สร้างโปรเจกต์ Supabase + สร้างตาราง `pc`, `notebook`, `ups`, `printer` (ทุกฟิลด์เป็น text ตาม key ใน `lib/schema.ts`) + เปิด RLS ให้เฉพาะผู้ใช้ที่ login
2. ติดตั้ง `@supabase/supabase-js @supabase/ssr` แล้วเขียน `SupabaseStore implements DataStore`
3. สลับใน `getStore()`: ถ้ามี `NEXT_PUBLIC_SUPABASE_URL` ให้ใช้ `SupabaseStore` ไม่งั้นใช้ localStorage
4. เพิ่มหน้า login (Supabase Auth email/password, ปิด public signup, สร้างผู้ใช้ 2 คนใน dashboard) + `middleware.ts` กันทุกหน้า
5. Deploy บน Vercel: import repo → ตั้ง env `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Deploy

> แผนละเอียด (schema SQL, RLS policy, ขั้นตอน migrate seed) ดูรายละเอียดที่วางไว้แล้วในไฟล์แผนของโปรเจกต์

## โครงสร้างโค้ด

| ไฟล์ | หน้าที่ |
| --- | --- |
| `lib/schema.ts` | นิยามฟิลด์/ฟอร์ม/คอลัมน์ของครุภัณฑ์แต่ละประเภท + กลุ่มงาน + ค่าเครือข่าย |
| `lib/data.ts` | ชั้นข้อมูล (`DataStore`) — ตอนนี้เป็น localStorage, เตรียมสลับเป็น Supabase |
| `lib/seed-data.json` | ข้อมูลตั้งต้นจาก spreadsheet เดิม (pc 91, notebook 30, ups 84, printer 57) |
| `lib/csv.ts` | Export CSV |
| `app/page.tsx` | หน้าภาพรวม |
| `app/[type]/page.tsx` | หน้าตารางครุภัณฑ์ต่อประเภท |
| `components/AppShell.tsx` | Header + แท็บนำทาง (ตัวเลขอัปเดตอัตโนมัติเมื่อข้อมูลเปลี่ยน) |
| `components/AssetTable.tsx` | ตาราง + ค้นหา + กรอง + ปุ่มจัดการ |
| `components/RecordModal.tsx` | ฟอร์มเพิ่ม/แก้ไข (สร้างจาก schema อัตโนมัติ) |
| `prototype/original.html` | ไฟล์ต้นฉบับก่อนแปลงเป็น Next.js (เก็บไว้อ้างอิง) |
