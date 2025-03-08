import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { formattedDate, notes, tag, movements } = await req.json();

  const count = await prisma.workoutLog.count();
  console.log("Total workout logs:", count);  

  try {
    for (const mov of movements) {
      const trimmedName = mov.name.trim();
      if (trimmedName) {
        await prisma.exercise.upsert({
          where: { name: trimmedName },
          update: {lastLogged: new Date(),},
          create: { name: trimmedName, lastLogged: new Date(), },
        });
      }
    }

    const newWorkout = await prisma.workoutLog.upsert({
      where: { formattedDate },
      update: {
        notes,
        tags: tag,
        movements: {
          deleteMany: {},
          create: movements.map(
            (movement: {
              name: string;
              sets: { weight: number; reps: number; setNumber: number }[];
            }) => ({
              name: movement.name,
              sets: {
                create: movement.sets
                  .filter((s) => Number.isInteger(s.setNumber))
                  .map((s) => ({
                    weight: s.weight,
                    reps: s.reps,
                    setNumber: s.setNumber,
                  })),
              },
              dropsets: {
                create: movement.sets
                  .filter((s) => !Number.isInteger(s.setNumber))
                  .map((s) => ({
                    weight: s.weight,
                    reps: s.reps,
                    setNumber: s.setNumber,
                  })),
              },
            })
          ),
        },
      },
      create: {
        formattedDate,
        notes,
        tags: tag,
        movements: {
          create: movements.map(
            (movement: {
              name: string;
              sets: { weight: number; reps: number; setNumber: number }[];
            }) => ({
              name: movement.name,
              sets: {
                create: movement.sets
                  .filter((s) => Number.isInteger(s.setNumber))
                  .map((s) => ({
                    weight: s.weight,
                    reps: s.reps,
                    setNumber: s.setNumber,
                  })),
              },
              dropsets: {
                create: movement.sets
                  .filter((s) => !Number.isInteger(s.setNumber))
                  .map((s) => ({
                    weight: s.weight,
                    reps: s.reps,
                    setNumber: s.setNumber,
                  })),
              },
            })
          ),
        },
      },
    });

    for (const movement of movements) {
      if (movement.sets && movement.sets.length > 0) {
        const bestSet = movement.sets.reduce(
          (best: { weight: number; reps: number }, curr: { weight: number; reps: number }) =>
            curr.weight > best.weight ? curr : best,
          movement.sets[0]
        );

        await prisma.exercisePR.create({
          data: {
            exerciseName: movement.name,
            bestWeight: bestSet.weight,
            bestReps: bestSet.reps,
            workoutDate: new Date(formattedDate),
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Workout logged successfully!", workout: newWorkout },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging workout:", error);
    return NextResponse.json({ error: "Failed to log workout" }, { status: 500 });
  }
}
