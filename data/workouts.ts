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
