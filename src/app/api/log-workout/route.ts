import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { formattedDate, notes, tag, movements } = await req.json() as {
      formattedDate: string;
      notes: string;
      tag: string;
      movements: {
        name: string;
        sets: { weight: number; reps: number; setNumber: number }[];
      }[];
    };

    const newWorkout = await prisma.workoutLog.create({
      data: {
        formattedDate,
        notes,
        tags: tag,
        movements: {
          create: movements.map((movement) => ({
            name: movement.name,
            // Create normal sets (where setNumber is an integer)
            sets: {
              create: movement.sets
                .filter((s) => Number.isInteger(s.setNumber))
                .map((s) => ({
                  weight: s.weight,
                  reps: s.reps,
                  setNumber: s.setNumber,
                })),
            },
            // Create dropsets (where setNumber is not an integer)
            dropsets: {
              create: movement.sets
                .filter((s) => !Number.isInteger(s.setNumber))
                .map((s) => ({
                  weight: s.weight,
                  reps: s.reps,
                  setNumber: s.setNumber,
                })),
            },
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Workout logged successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging workout:", error);
    return NextResponse.json(
      { error: "Failed to log workout" },
      { status: 500 }
    );
  }
}
