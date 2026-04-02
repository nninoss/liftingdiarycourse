import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewWorkoutForm } from "./_components/new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="flex flex-col items-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </main>
  );
}
