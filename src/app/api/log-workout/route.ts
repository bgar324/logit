import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { formattedDate, notes, tags, movements } = await req.json() as {
      formattedDate: string;
      notes: string;
      tags: string[]; // Now an array of tag names
      movements: {
        name: string;
        sets: { weight: number; reps: number }[];
      }[];
    };

    const newWorkout = await prisma.workoutLog.create({
      data: {
        formattedDate,
        notes,
        tags, // Directly store the array of tag names
        movements: {
          create: movements.map((movement) => ({
            name: movement.name,
            sets: {
              create: movement.sets, // Each set with weight and reps
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
