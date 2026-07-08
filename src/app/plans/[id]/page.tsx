import { PlanDetailClient } from "@/components/plans/PlanDetailClient";
import { plans } from "@/lib/data/plans";

export async function generateStaticParams() {
  return plans.map((plan) => ({
    id: plan.id,
  }));
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlanDetailClient id={id} />;
}
