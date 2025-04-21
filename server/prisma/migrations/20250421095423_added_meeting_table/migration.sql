-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "join_url" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);
