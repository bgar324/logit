import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { date, notes, tags, movements } = await req.json();

    // Step 1: Create Workout Log
    const newWorkout = await prisma.workoutLog.create({
      data: {
        date: new Date(date),
        notes,
        movements: {
          create: movements.map((movement: any) => ({
            name: movement.name,
            sets: {
              create: movement.sets.map((set: any) => ({
                weight: set.weight,
                reps: set.reps,
              })),
            },
          })),
        },
      },
    });

    // Step 2: Link Tags to the Workout Log
    if (tags && tags.length > 0) {
      await prisma.workoutLogTag.createMany({
        data: tags.map((tag: string) => ({
          workoutLogId: newWorkout.id,
          tagId: tag, // Assuming tag is passed as an ID
        })),
        skipDuplicates: true, // Prevent duplicate entries
      });
    }

    // Step 3: Update WorkoutGlobal with the PRs
    for (const movement of movements) {
      const highestSet = movement.sets.reduce(
        (max: any, set: any) => (set.weight > max.weight ? set : max),
        { weight: 0, reps: 0 }
      );

      // ✅ FIX: Await the existing PR lookup before using bestWeight
      const existingPR = await prisma.workoutGlobal.findUnique({
        where: { movement: movement.name },
      });

      const updatedWeight =
        highestSet.weight > (existingPR?.bestWeight || 0)
          ? highestSet.weight
          : existingPR?.bestWeight;

      await prisma.workoutGlobal.upsert({
        where: { movement: movement.name },
        update: {
          bestWeight: updatedWeight,
          bestReps: highestSet.reps,
        },
        create: {
          movement: movement.name,
          bestWeight: highestSet.weight,
          bestReps: highestSet.reps,
        },
      });
    }

    return NextResponse.json(
      { message: "Workout logged successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging workout:", error);
    return NextResponse.json({ error: "Failed to log workout" }, { status: 500 });
  }
}
