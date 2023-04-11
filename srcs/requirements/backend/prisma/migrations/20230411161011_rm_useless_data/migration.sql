/*
  Warnings:

  - You are about to drop the column `elo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `User` table. All the data in the column will be lost.
  - Made the column `hash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "elo",
DROP COLUMN "email",
DROP COLUMN "rank",
ALTER COLUMN "hash" SET NOT NULL;
