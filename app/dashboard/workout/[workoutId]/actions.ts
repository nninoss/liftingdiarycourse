"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export async function updateWorkoutAction(input: {
  workoutId: string;
  name: string;
  date: string;
  notes?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = updateWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const [workout] = await updateWorkout(
    userId,
    parsed.data.workoutId,
    parsed.data.name,
    parsed.data.date,
    parsed.data.notes
  );

  return { data: workout };
}
