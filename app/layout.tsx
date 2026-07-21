import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PasscodeGate from "@/components/PasscodeGate";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <PasscodeGate>
          <AppShell>{children}</AppShell>
        </PasscodeGate>
      </body>
    </html>
  );
}
