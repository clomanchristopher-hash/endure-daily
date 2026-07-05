import { JourneyDay } from "@/types";

// Renders a journey day's workout: a structured exercise list (strength) or a
// simple prose line (running / rest / mobility).
export function WorkoutDetails({ day }: { day: JourneyDay }) {
  if (day.exercises && day.exercises.length > 0) {
    return (
      <ul className="mt-2 flex flex-col gap-2">
        {day.exercises.map((ex) => (
          <li key={ex.name} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{ex.name}</span>
            <span className="shrink-0 text-muted">{ex.scheme}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="mt-2 text-sm leading-relaxed text-foreground/90">{day.workout_text}</p>;
}
