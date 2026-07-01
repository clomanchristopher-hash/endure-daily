import { PlanDetailClient } from "@/components/plans/PlanDetailClient";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlanDetailClient id={id} />;
}
