-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropIndex
DROP INDEX "Message_roomId_key";

-- DropIndex
DROP INDEX "Room_roomId_key";
