-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "status" "MeetingStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "meeting_id" SET DATA TYPE TEXT;
