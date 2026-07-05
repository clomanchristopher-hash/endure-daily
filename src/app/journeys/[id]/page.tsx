import { JourneyDetail } from "@/components/journeys/JourneyDetail";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JourneyDetail id={id} />;
}
