import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PasscodeGate from "@/components/PasscodeGate";
<<<<<<< HEAD
import { getCounts } from "@/lib/queries";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
=======
>>>>>>> efe2fa82cc3d98979f447563e8b9b2f3a557cabb

const sans = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ทะเบียนครุภัณฑ์คอมพิวเตอร์ สคอ.",
  description: "ระบบจัดเก็บและค้นหาข้อมูลครุภัณฑ์ไอที",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึงจำนวนต่อ type ฝั่ง server (cache) — ส่งให้ AppShell ตัด client fetch waterfall ตอนโหลด
  let counts: Record<AssetType, number>;
  try {
    counts = await getCounts();
  } catch {
    counts = Object.fromEntries(ASSET_TYPES.map((t) => [t, 0])) as Record<
      AssetType,
      number
    >;
  }

  return (
    <html lang="th" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <PasscodeGate>
<<<<<<< HEAD
          <AppShell initialCounts={counts}>{children}</AppShell>
=======
          <AppShell>{children}</AppShell>
>>>>>>> efe2fa82cc3d98979f447563e8b9b2f3a557cabb
        </PasscodeGate>
      </body>
    </html>
  );
}
