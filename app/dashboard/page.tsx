import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getWorkoutsForDate } from "@/data/workouts";
import { WorkoutCalendar } from "./_components/workout-calendar";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ?? format(new Date(), "yyyy-MM-dd");

  const workouts = await getWorkoutsForDate(userId, selectedDate);

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <WorkoutCalendar workouts={workouts} selectedDate={selectedDate} />
    </main>
  );
}
