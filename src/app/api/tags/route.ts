import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tags = await prisma.tags.findMany({
      select: { tagName: true },
    });
    
    return NextResponse.json(
      { tags: tags.map(tag => tag.tagName) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}