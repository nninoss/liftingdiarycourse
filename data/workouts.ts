import { db } from "@/app/db";
import { workouts } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function getWorkoutsForDate(userId: string, date: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));
}

export async function getWorkoutById(userId: string, workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return workout ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  name: string,
  date: string,
  notes?: string
) {
  return db
    .update(workouts)
    .set({ name, date, notes })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}

export async function createWorkout(
  userId: string,
  name: string,
  date: string,
  notes?: string
) {
  return db
    .insert(workouts)
    .values({ userId, name, date, notes })
    .returning();
}
