/*
  Warnings:

  - You are about to drop the column `is_offline` on the `Timeslot` table. All the data in the column will be lost.
  - You are about to drop the column `is_online` on the `Timeslot` table. All the data in the column will be lost.
  - Added the required column `mode` to the `Timeslot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsultationMode" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Timeslot" DROP COLUMN "is_offline",
DROP COLUMN "is_online",
ADD COLUMN     "mode" "ConsultationMode" NOT NULL;
