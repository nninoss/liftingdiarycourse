import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { workoutId } = await params;
  const workout = await getWorkoutById(userId, workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm workout={workout} />
        </CardContent>
      </Card>
    </main>
  );
}
