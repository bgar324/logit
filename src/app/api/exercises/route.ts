import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ exercises: [] }, { status: 200 });
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    return NextResponse.json({ exercises }, { status: 200 });
  } catch (err) {
    console.error("Error searching exercises:", err);
    return NextResponse.json(
      { error: "Failed to query exercises" },
      { status: 500 }
    );
  }
} 

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  try {
    const exercise = await prisma.exercise.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    return NextResponse.json({ exercise }, { status: 201 })
  } catch (error) {
    console.error("Error upserting exercise:", error)
    return NextResponse.json({ error: "Failed to upsert exercise" }, { status: 500 })
  }
}