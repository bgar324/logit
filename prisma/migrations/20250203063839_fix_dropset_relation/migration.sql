/*
  Warnings:

  - Added the required column `setNumber` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "setNumber" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "reps" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WorkoutGlobal" ALTER COLUMN "bestReps" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Dropset" (
    "id" TEXT NOT NULL,
    "movementId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" DOUBLE PRECISION NOT NULL,
    "setNumber" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Dropset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dropset" ADD CONSTRAINT "Dropset_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
