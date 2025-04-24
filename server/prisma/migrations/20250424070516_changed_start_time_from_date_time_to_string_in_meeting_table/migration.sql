/*
  Warnings:

  - A unique constraint covering the columns `[meeting_id]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "start_time" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meeting_id_key" ON "Meeting"("meeting_id");
