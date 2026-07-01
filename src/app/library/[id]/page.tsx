import { DevotionDetailClient } from "@/components/devotion/DevotionDetailClient";

export default async function DevotionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DevotionDetailClient id={id} />;
}
