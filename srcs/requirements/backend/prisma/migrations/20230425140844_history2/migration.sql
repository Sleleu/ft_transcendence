/*
  Warnings:

  - Added the required column `elo` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsLost` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsWon` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "elo" INTEGER NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL,
ADD COLUMN     "pointsLost" INTEGER NOT NULL,
ADD COLUMN     "pointsWon" INTEGER NOT NULL,
ADD COLUMN     "result" TEXT NOT NULL;
