import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.exercise.createMany({
    data: [
      { name: "chest press" },
      { name: "bench press" },
      { name: "incline bench press" },
      { name: "dumbbell fly" },
      { name: "squat" },
      { name: "leg press" },
      // etc...
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });