/*
  Warnings:

  - You are about to drop the column `password_reset_expires_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_reset_token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password_reset_otp]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_password_reset_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_reset_expires_at",
DROP COLUMN "password_reset_token",
ADD COLUMN     "password_reset_otp" TEXT,
ADD COLUMN     "password_reset_otp_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_password_reset_otp_key" ON "User"("password_reset_otp");
