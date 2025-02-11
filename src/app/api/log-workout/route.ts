import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { formattedDate, notes, tag, movements } = await req.json();
  try {
    for (const mov of movements) {
      const trimmedName = mov.name.trim();
      if (trimmedName) {
        await prisma.exercise.upsert({
          where: { name: trimmedName },
          update: {},
          create: { name: trimmedName },
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
          create: movements.map((movement: { name: string; sets: { weight: number; reps: number; setNumber: number }[] }) => ({
            name: movement.name,
            sets: {
              create: movement.sets.filter((s) => Number.isInteger(s.setNumber)).map((s) => ({
                weight: s.weight,
                reps: s.reps,
                setNumber: s.setNumber
              }))
            },
            dropsets: {
              create: movement.sets.filter((s) => !Number.isInteger(s.setNumber)).map((s) => ({
                weight: s.weight,
                reps: s.reps,
                setNumber: s.setNumber
              }))
            }
          }))
        }
      },
      create: {
        formattedDate,
        notes,
        tags: tag,
        movements: {
          create: movements.map((movement: { name: string; sets: { weight: number; reps: number; setNumber: number }[] }) => ({
            name: movement.name,
            sets: {
              create: movement.sets.filter((s) => Number.isInteger(s.setNumber)).map((s) => ({
                weight: s.weight,
                reps: s.reps,
                setNumber: s.setNumber
              }))
            },
            dropsets: {
              create: movement.sets.filter((s) => !Number.isInteger(s.setNumber)).map((s) => ({
                weight: s.weight,
                reps: s.reps,
                setNumber: s.setNumber
              }))
            }
          }))
        }
      }
    });
    return NextResponse.json({ message: "Workout logged successfully!", workout: newWorkout }, { status: 201 });
  } catch (error) {
    console.error("Error logging workout:", error);
    return NextResponse.json({ error: "Failed to log workout" }, { status: 500 });
  }
}
