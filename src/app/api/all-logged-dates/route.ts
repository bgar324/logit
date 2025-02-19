import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseFormattedDate(str: string): string | null {
  try {
    const currentYear = new Date().getFullYear();
    
    const dateString = `${str}, ${currentYear}`;

    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const logs = await prisma.workoutLog.findMany({
      select: { formattedDate: true },
    });

    const dates: string[] = [];
    logs.forEach((log) => {
      if (log.formattedDate) {
        const isoString = parseFormattedDate(log.formattedDate);
        if (isoString) {
          dates.push(isoString);
        }
      }
    });

    return NextResponse.json({ dates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logged dates:", error);
    return NextResponse.json({ error: "Failed to fetch logged dates" }, { status: 500 });
  }
}
