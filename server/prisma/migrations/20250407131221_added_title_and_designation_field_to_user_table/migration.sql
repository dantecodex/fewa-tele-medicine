-- CreateEnum
CREATE TYPE "Title" AS ENUM ('DR', 'MR', 'MRS', 'MISS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "designation" TEXT,
ADD COLUMN     "title" "Title";
