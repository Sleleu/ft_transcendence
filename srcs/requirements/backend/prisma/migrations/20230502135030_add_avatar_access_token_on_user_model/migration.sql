-- AlterTable
ALTER TABLE "users" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "avatar" TEXT,
ALTER COLUMN "hash" DROP NOT NULL;
