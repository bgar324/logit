// app/api/workout/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const formattedDate = searchParams.get("formattedDate");
  if (!formattedDate) {
    return NextResponse.json(
      { error: "formattedDate query param missing" },
      { status: 400 }
    );
  }

  try {
    const workout = await prisma.workoutLog.findUnique({
      where: { formattedDate },
      include: {
        movements: {
          include: {
            sets: true,
            dropsets: true,
          },
        },
      },
    });

    return NextResponse.json({ workout }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json({ error: "Failed to fetch workout" }, { status: 500 });
  }
}
