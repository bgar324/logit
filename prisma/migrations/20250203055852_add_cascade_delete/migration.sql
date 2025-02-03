-- DropForeignKey
ALTER TABLE "Movement" DROP CONSTRAINT "Movement_logId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_movementId_fkey";

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_logId_fkey" FOREIGN KEY ("logId") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
