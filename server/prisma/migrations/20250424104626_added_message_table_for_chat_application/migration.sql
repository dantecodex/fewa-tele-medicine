-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sender_Id" INTEGER NOT NULL,
    "receiver_Id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "by_room_and_time" ON "Message"("room_id", "created_at");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_Id_fkey" FOREIGN KEY ("sender_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_Id_fkey" FOREIGN KEY ("receiver_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
