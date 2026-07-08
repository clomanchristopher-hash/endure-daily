import { JourneyDetail } from "@/components/journeys/JourneyDetail";
import { journeys } from "@/lib/data/journeys";

export async function generateStaticParams() {
  return journeys.map((journey) => ({
    id: journey.id,
  }));
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JourneyDetail id={id} />;
}
