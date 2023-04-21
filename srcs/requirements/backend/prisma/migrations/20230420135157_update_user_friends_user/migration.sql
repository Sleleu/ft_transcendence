/*
  Warnings:

  - Added the required column `elo` to the `friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "elo" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "state" DROP DEFAULT;
