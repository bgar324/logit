import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: [
        { lastLogged: 'asc' },  // newest logs at the top
        { name: 'asc' },         // tiebreak by name if needed
      ],
    });
    return NextResponse.json({ exercises }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all exercises:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
