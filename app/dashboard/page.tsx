"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockWorkouts = [
  { id: 1, name: "Push Day", date: new Date() },
  { id: 2, name: "Leg Day", date: new Date() },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const workoutsForDate = mockWorkouts.filter(
    (w) => format(w.date, "do MMMM yyyy") === format(date, "do MMMM yyyy")
  );

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => d && setDate(d)}
      />

      <section className="w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold">
          Workouts for {format(date, "do MMMM yyyy")}
        </h2>

        {workoutsForDate.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {workoutsForDate.map((workout) => (
              <li key={workout.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {format(workout.date, "do MMMM yyyy")}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
