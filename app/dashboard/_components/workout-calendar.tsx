"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workout = {
  id: string;
  name: string | null;
  date: string;
};

export function WorkoutCalendar({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: string;
}) {
  const router = useRouter();
  const date = parseISO(selectedDate);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
  }

  return (
    <>
      <Calendar mode="single" selected={date} onSelect={handleSelect} />

      <section className="w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold">
          Workouts for {format(date, "do MMMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <li key={workout.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{workout.name ?? "Untitled Workout"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(workout.date), "do MMMM yyyy")}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
