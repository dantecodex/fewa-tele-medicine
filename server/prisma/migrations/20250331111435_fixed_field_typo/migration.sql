/*
  Warnings:

  - You are about to drop the column `is_verfied` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_verfied",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
