import type { CSSProperties } from "react";

/**
 * ไอคอน SVG inline (Tabler outline, viewBox 24) — เฉพาะที่ระบบใช้จริง
 * แทน @tabler/icons-webfont ทั้งชุด (woff2 ~737KB) เพื่อตัด render-block ตอนโหลดแรก
 * เพิ่มไอคอนใหม่: คัดลอก path จาก node_modules/@tabler/icons/icons/outline/<name>.svg
 */
const PATHS = {
  check: ["M5 12l5 5l10 -10"],
  "alert-triangle": [
    "M12 9v4",
    "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z",
    "M12 16h.01",
  ],
  "alert-circle": [
    "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
    "M12 8v4",
    "M12 16h.01",
  ],
  logout: [
    "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",
    "M9 12h12l-3 -3",
    "M18 15l3 -3",
  ],
  "layout-dashboard": [
    "M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1",
    "M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1",
    "M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1",
    "M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1",
  ],
  "stack-2": ["M12 4l-8 4l8 4l8 -4l-8 -4", "M4 12l8 4l8 -4", "M4 16l8 4l8 -4"],
  "users-group": [
    "M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
    "M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1",
    "M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
    "M17 10h2a2 2 0 0 1 2 2v1",
    "M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
    "M3 13v-1a2 2 0 0 1 2 -2h2",
  ],
  tag: [
    "M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z",
  ],
  network: [
    "M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0",
    "M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6",
    "M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6",
    "M6 9h12",
    "M3 20h7",
    "M14 20h7",
    "M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
    "M12 15v3",
  ],
  search: ["M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M21 21l-6 -6"],
  download: [
    "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
    "M7 11l5 5l5 -5",
    "M12 4l0 12",
  ],
  plus: ["M12 5l0 14", "M5 12l14 0"],
  inbox: [
    "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z",
    "M4 13h3l3 3h4l3 -3h3",
  ],
  edit: [
    "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1",
    "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z",
    "M16 5l3 3",
  ],
  trash: [
    "M4 7l16 0",
    "M10 11l0 6",
    "M14 11l0 6",
    "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",
    "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
  ],
  "lock-open": [
    "M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z",
    "M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M8 11v-5a4 4 0 0 1 8 0",
  ],
  "device-desktop": [
    "M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z",
    "M7 20h10",
    "M9 16v4",
    "M15 16v4",
  ],
  "device-laptop": [
    "M3 19l18 0",
    "M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z",
  ],
  "battery-charging": [
    "M16 7h1a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-2",
    "M8 7h-2a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h1",
    "M12 8l-2 4h3l-2 4",
  ],
  printer: [
    "M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2",
    "M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4",
    "M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z",
  ],
  x: ["M18 6l-12 12", "M6 6l12 12"],
} as const;

export type IconName = keyof typeof PATHS;

/** true = ชื่อไอคอนนี้มีใน PATHS (ใช้ narrow ค่า string จาก schema) */
export function isIconName(name: string): name is IconName {
  return name in PATHS;
}

/**
 * แทน <i className="ti ti-xxx"> เดิม — svg ขนาด 1em, stroke = currentColor
 * ทำให้สืบทอด font-size และสีจาก parent เหมือน webfont เดิมทุกจุด
 */
export default function Icon({
  name,
  className,
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `icon ${className}` : "icon"}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
