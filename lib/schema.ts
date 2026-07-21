import type { AssetType } from "./types";
import type { IconName } from "@/components/Icon";

/** ชนิด input ของฟิลด์ในฟอร์ม: text | datalist:<source> | select:<opt1,opt2,...> */
export type FieldDef = {
  key: string;
  label: string;
  input?: string;
  full?: boolean;
};
export type SectionDef = { title: string; fields: FieldDef[] };
export type TypeSchema = {
  label: string;
  icon: IconName;
  singular: string;
  tableCols: [key: string, label: string][];
  groupField: string;
  sections: SectionDef[];
};

export const GROUPS = [
  "บริหารทั่วไป",
  "ยุทธศาสตร์และพัฒนาองค์กร",
  "พัฒนาวิชาการ",
  "พัฒนากฎหมาย",
  "เฝ้าระวังและบังคับใช้กฎหมาย",
  "ภาคีเครือข่ายและสื่อสารสาธารณะ",
];

export const OS_OPTS = ["11 Pro", "11 Home", "10 Pro", "10 Home"];
export const PREFIX_OPTS = ["นาย", "นาง", "นางสาว", "-"];

/** ฟิลด์ที่แสดงด้วยฟอนต์ mono (เลขครุภัณฑ์, IP, MAC ฯลฯ) */
export const MONO_KEYS = new Set([
  "asset",
  "ip",
  "macLan",
  "macWifi",
  "computerName",
]);

export const SCHEMA: Record<AssetType, TypeSchema> = {
  pc: {
    label: "คอมพิวเตอร์",
    icon: "device-desktop",
    singular: "เครื่องคอมพิวเตอร์",
    tableCols: [
      ["name", "ชื่อ-นามสกุล"],
      ["group", "กลุ่มงาน"],
      ["asset", "เลขครุภัณฑ์"],
      ["brand", "ยี่ห้อ"],
      ["model", "รุ่น"],
      ["computerName", "Computer Name"],
      ["ip", "IP Address"],
      ["os", "Windows"],
    ],
    groupField: "group",
    sections: [
      {
        title: "ผู้ใช้งาน",
        fields: [
          { key: "prefix", label: "คำนำหน้า", input: "datalist:prefix" },
          { key: "name", label: "ชื่อ-นามสกุล", full: true },
          { key: "group", label: "กลุ่มงาน", input: "datalist:group" },
        ],
      },
      {
        title: "ข้อมูลครุภัณฑ์",
        fields: [
          { key: "asset", label: "เลขครุภัณฑ์" },
          { key: "year", label: "ปีที่ได้รับ (พ.ศ.)" },
          { key: "budget", label: "งบประมาณ" },
          { key: "standard", label: "มาตรฐานครุภัณฑ์" },
          { key: "brand", label: "ยี่ห้อ", input: "datalist:brand" },
          { key: "model", label: "รุ่น" },
        ],
      },
      {
        title: "เครือข่าย",
        fields: [
          { key: "computerName", label: "Computer Name" },
          { key: "ip", label: "IP Address" },
          { key: "macLan", label: "MAC (LAN)" },
          { key: "macWifi", label: "MAC (WiFi)" },
        ],
      },
      {
        title: "ฮาร์ดแวร์",
        fields: [
          { key: "ssdSata", label: "SSD (SATA)" },
          { key: "ssdM2", label: "SSD (M.2)" },
          { key: "hdd", label: "HDD" },
          { key: "ramType", label: "ชนิด RAM" },
          { key: "ramSize", label: "ขนาด RAM" },
          { key: "ramBus", label: "Bus RAM" },
          { key: "cpu", label: "CPU", full: true },
          { key: "cpuSocket", label: "Socket" },
          { key: "cpuFreq", label: "ความเร็ว CPU" },
          { key: "cpuCores", label: "Cores" },
          { key: "cpuThreads", label: "Threads" },
          { key: "gpu", label: "การ์ดจอ" },
          { key: "gpuMem", label: "หน่วยความจำการ์ดจอ" },
        ],
      },
      {
        title: "ซอฟต์แวร์",
        fields: [
          { key: "os", label: "Windows", input: "datalist:os" },
          { key: "osVersion", label: "เวอร์ชัน" },
          { key: "antivirus", label: "Antivirus" },
        ],
      },
    ],
  },
  notebook: {
    label: "โน้ตบุ๊ก",
    icon: "device-laptop",
    singular: "โน้ตบุ๊ก",
    tableCols: [
      ["asset", "เลขครุภัณฑ์"],
      ["group", "กลุ่มงาน"],
      ["brand", "ยี่ห้อ"],
      ["model", "รุ่น"],
      ["computerName", "Computer Name"],
      ["os", "Windows"],
    ],
    groupField: "group",
    sections: [
      {
        title: "ข้อมูลครุภัณฑ์",
        fields: [
          { key: "group", label: "กลุ่มงาน", input: "datalist:group", full: true },
          { key: "asset", label: "เลขครุภัณฑ์" },
          { key: "year", label: "ปีที่ได้รับ (พ.ศ.)" },
          { key: "brand", label: "ยี่ห้อ", input: "datalist:brand" },
          { key: "model", label: "รุ่น" },
          { key: "computerName", label: "Computer Name", full: true },
        ],
      },
      {
        title: "ฮาร์ดแวร์",
        fields: [
          { key: "ssdSata", label: "SSD (SATA)" },
          { key: "ssdM2", label: "SSD (M.2)" },
          { key: "hdd", label: "HDD" },
          { key: "ramType", label: "ชนิด RAM" },
          { key: "ramSize", label: "ขนาด RAM" },
          { key: "ramBus", label: "Bus RAM" },
          { key: "cpu", label: "CPU", full: true },
          { key: "cpuFreq", label: "ความเร็ว CPU" },
          { key: "cpuCores", label: "Cores" },
          { key: "cpuThreads", label: "Threads" },
          { key: "gpu", label: "การ์ดจอ" },
          { key: "gpuMem", label: "หน่วยความจำการ์ดจอ" },
        ],
      },
      {
        title: "ซอฟต์แวร์",
        fields: [
          { key: "os", label: "Windows", input: "datalist:os" },
          { key: "osVersion", label: "เวอร์ชัน" },
          { key: "antivirus", label: "Antivirus" },
        ],
      },
    ],
  },
  ups: {
    label: "UPS",
    icon: "battery-charging",
    singular: "เครื่องสำรองไฟ",
    tableCols: [
      ["name", "ชื่อ-นามสกุล"],
      ["group", "กลุ่มงาน"],
      ["asset", "เลขครุภัณฑ์"],
      ["brand", "ยี่ห้อ"],
      ["model", "รุ่น"],
      ["capacity", "ความจุ"],
    ],
    groupField: "group",
    sections: [
      {
        title: "ผู้ใช้งาน",
        fields: [
          { key: "prefix", label: "คำนำหน้า", input: "datalist:prefix" },
          { key: "name", label: "ชื่อ-นามสกุล", full: true },
          { key: "group", label: "กลุ่มงาน", input: "datalist:group" },
        ],
      },
      {
        title: "ข้อมูลครุภัณฑ์",
        fields: [
          { key: "asset", label: "เลขครุภัณฑ์" },
          { key: "year", label: "ปีที่ได้รับ (พ.ศ.)" },
          { key: "budget", label: "งบประมาณ" },
          { key: "standard", label: "มาตรฐานครุภัณฑ์" },
          { key: "brand", label: "ยี่ห้อ", input: "datalist:brand" },
          { key: "model", label: "รุ่น" },
          { key: "capacity", label: "ความจุ" },
        ],
      },
    ],
  },
  printer: {
    label: "Printer / Scanner",
    icon: "printer",
    singular: "เครื่องพิมพ์/สแกน",
    tableCols: [
      ["owner", "ผู้รับผิดชอบ"],
      ["building", "อาคาร"],
      ["brand", "ยี่ห้อ"],
      ["model", "รุ่น"],
      ["type", "ประเภท"],
      ["ip", "IP Address"],
    ],
    groupField: "building",
    sections: [
      {
        title: "ข้อมูลครุภัณฑ์",
        fields: [
          { key: "owner", label: "ผู้รับผิดชอบ", full: true },
          { key: "building", label: "อาคาร", input: "select:อาคาร 3,อาคาร 8" },
          { key: "asset", label: "เลขครุภัณฑ์" },
          { key: "year", label: "ปีที่ได้รับ (พ.ศ.)" },
          { key: "brand", label: "ยี่ห้อ", input: "datalist:brand" },
          { key: "model", label: "รุ่น" },
          { key: "type", label: "ประเภท", input: "datalist:type", full: true },
        ],
      },
      {
        title: "เครือข่าย",
        fields: [
          { key: "ip", label: "IP Address" },
          { key: "macLan", label: "MAC (LAN)" },
        ],
      },
    ],
  },
};

/** ข้อมูลเครือข่ายของหน่วยงาน (แสดงบนหน้าภาพรวม — อ่านอย่างเดียว) */
export const NETWORK_INFO = [
  "IP Address : 10.100.31.1 - 10.100.31.254(อาคาร 3) ,10.100.81.1 - 10.100.81.254(อาคาร 8)",
  "Subnet Mask : 255.255.255.0",
  "Gateway : 10.100.31.1(อาคาร 3) , 10.100.81.1(อาคาร 8)",
  "Preferred DNS Server : 203.157.19.113(อาคาร 3) , 203.157.19.113(อาคาร 8)",
  "Alternate DNS Server : 192.168.100.250",
];
