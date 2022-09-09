/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TopicType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TopicType_name_key" ON "TopicType"("name");
