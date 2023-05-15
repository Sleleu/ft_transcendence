-- CreateTable
CREATE TABLE "_RoomWhitelist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomWhitelist_AB_unique" ON "_RoomWhitelist"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomWhitelist_B_index" ON "_RoomWhitelist"("B");

-- AddForeignKey
ALTER TABLE "_RoomWhitelist" ADD CONSTRAINT "_RoomWhitelist_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomWhitelist" ADD CONSTRAINT "_RoomWhitelist_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
