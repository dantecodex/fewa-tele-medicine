-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verfied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3);
