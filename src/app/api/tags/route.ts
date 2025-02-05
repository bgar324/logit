// app/api/tags/route.ts (App Router approach)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/tags
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ message: "Invalid tag name" }, { status: 400 });
    }

    // Either find an existing tag or create a new one
    let tag = await prisma.tag.findUnique({ where: { name } });

    if (!tag) {
      tag = await prisma.tag.create({ data: { name } });
    }

    return NextResponse.json({ tag }, { status: 200 });
  } catch (error) {
    console.error("Error creating/finding tag:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // For query params, parse them from the request URL
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json({ message: "No name provided" }, { status: 400 });
    }

    await prisma.tag.delete({ where: { name } });

    return NextResponse.json({ message: "Tag deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}