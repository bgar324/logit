import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exerciseName = searchParams.get("exerciseName");
  if (!exerciseName) {
    return NextResponse.json({ error: "exerciseName missing" }, { status: 400 });
  }
  try {
    const prRecords = await prisma.exercisePR.findMany({
      where: { exerciseName },
      orderBy: { workoutDate: "asc" },
    });
    return NextResponse.json({ prRecords });
  } catch (error) {
    console.error("Error fetching PR records:", error);
    return NextResponse.json({ error: "Failed to fetch PR records" }, { status: 500 });
  }
}
