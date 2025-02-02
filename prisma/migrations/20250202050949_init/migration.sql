/*
  Warnings:

  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutGlobal" (
    "id" TEXT NOT NULL,
    "movement" TEXT NOT NULL,
    "bestWeight" DOUBLE PRECISION NOT NULL,
    "bestReps" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutGlobal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLogTag" (
    "workoutLogId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutLogTag_pkey" PRIMARY KEY ("workoutLogId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutGlobal_movement_key" ON "WorkoutGlobal"("movement");

-- AddForeignKey
ALTER TABLE "WorkoutLogTag" ADD CONSTRAINT "WorkoutLogTag_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLogTag" ADD CONSTRAINT "WorkoutLogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
