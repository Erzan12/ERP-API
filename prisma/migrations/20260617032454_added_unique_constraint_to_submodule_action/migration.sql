/*
  Warnings:

  - A unique constraint covering the columns `[action]` on the table `SubModuleAction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubModuleAction_action_key" ON "SubModuleAction"("action");
