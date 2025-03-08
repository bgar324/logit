/*
  Warnings:

  - You are about to drop the `WorkoutGlobal` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "lastLogged" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "exerciseId" INTEGER;

-- DropTable
DROP TABLE "WorkoutGlobal";

-- CreateTable
CREATE TABLE "ExercisePR" (
    "id" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "bestWeight" DOUBLE PRECISION NOT NULL,
    "bestReps" DOUBLE PRECISION NOT NULL,
    "workoutDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExercisePR_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExercisePR_exerciseName_workoutDate_key" ON "ExercisePR"("exerciseName", "workoutDate");

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
