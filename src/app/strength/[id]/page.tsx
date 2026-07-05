import { StrengthPlanDetail } from "@/components/strength/StrengthPlanDetail";

export default async function StrengthPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StrengthPlanDetail id={id} />;
}
