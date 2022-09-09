/*
  Warnings:

  - A unique constraint covering the columns `[name,courseID]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_courseID_key" ON "Topic"("name", "courseID");
