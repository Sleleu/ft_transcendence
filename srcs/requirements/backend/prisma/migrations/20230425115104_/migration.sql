/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "loose" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "win" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "friends_userId_friendId_key" ON "friends"("userId", "friendId");
