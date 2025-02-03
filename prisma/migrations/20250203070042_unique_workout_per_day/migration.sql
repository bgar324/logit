/*
  Warnings:

  - A unique constraint covering the columns `[formattedDate]` on the table `WorkoutLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_formattedDate_key" ON "WorkoutLog"("formattedDate");
