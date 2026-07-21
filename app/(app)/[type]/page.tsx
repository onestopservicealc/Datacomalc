import { notFound } from "next/navigation";
import AssetTable from "@/components/AssetTable";
import { isAssetType } from "@/lib/types";
import { listAssets } from "@/lib/actions";

export const dynamic = "force-dynamic";

/** โหลดข้อมูลฝั่ง server แล้ว seed ให้ AssetTable — ไม่มี fetch ตอน mount, ไม่มี spinner */
export default async function AssetTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isAssetType(type)) notFound();
  const initial = await listAssets(type);
  return <AssetTable key={type} type={type} initial={initial} />;
}
