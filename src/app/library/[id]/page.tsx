import { DevotionDetailClient } from "@/components/devotion/DevotionDetailClient";
import { devotions } from "@/lib/data/devotions";

export async function generateStaticParams() {
  return devotions.map((devotion) => ({
    id: devotion.id,
  }));
}

export default async function DevotionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DevotionDetailClient id={id} />;
}
