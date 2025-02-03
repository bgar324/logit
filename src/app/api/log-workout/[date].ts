import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { date: string } }) {
  try {
    const { date } = params;
    
    const workout = await prisma.workoutLog.findUnique({
      where: { formattedDate: date },
      include: { movements: { include: { sets: true } } } // Include related movements & sets
    });

    return NextResponse.json(workout || { message: "No workout found for this date." });
  } catch (error) {
    return NextResponse.json({ error: "Error retrieving workout." }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { date: string } }) {
  try {
    const { date } = params;
    const { notes, tag, movements } = await req.json();

    const existingWorkout = await prisma.workoutLog.findUnique({ where: { formattedDate: date } });

    if (existingWorkout) {
      // Update existing log
      await prisma.workoutLog.update({
        where: { formattedDate: date },
        data: {
          notes,
          tag,
          movements: {
            deleteMany: {}, // Clear old movements
            create: movements.map((m: any) => ({
              name: m.name,
              sets: { create: m.sets }
            }))
          }
        }
      });
    } else {
      // Create new workout log
      await prisma.workoutLog.create({
        data: {
          formattedDate: date,
          notes,
          tag,
          movements: {
            create: movements.map((m: any) => ({
              name: m.name,
              sets: { create: m.sets }
            }))
          }
        }
      });
    }

    return NextResponse.json({ message: "Workout logged successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log workout" }, { status: 500 });
  }
}
