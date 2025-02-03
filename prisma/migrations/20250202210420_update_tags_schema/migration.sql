/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutLogTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutLogTag" DROP CONSTRAINT "WorkoutLogTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutLogTag" DROP CONSTRAINT "WorkoutLogTag_workoutLogId_fkey";

-- AlterTable
ALTER TABLE "WorkoutLog" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "WorkoutLogTag";
