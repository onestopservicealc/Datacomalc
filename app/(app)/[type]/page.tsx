"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import AssetTable from "@/components/AssetTable";
import { isAssetType } from "@/lib/types";

export default function AssetTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  if (!isAssetType(type)) notFound();
  return <AssetTable key={type} type={type} />;
}
