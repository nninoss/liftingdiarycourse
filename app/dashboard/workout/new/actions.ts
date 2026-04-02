"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export async function createWorkoutAction(input: {
  name: string;
  date: string;
  notes?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const [workout] = await createWorkout(
    userId,
    parsed.data.name,
    parsed.data.date,
    parsed.data.notes
  );

  return { data: workout };
}
