/*
  Warnings:

  - You are about to drop the column `date` on the `WorkoutLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutLog" DROP COLUMN "date",
ADD COLUMN     "formattedDate" TEXT;
