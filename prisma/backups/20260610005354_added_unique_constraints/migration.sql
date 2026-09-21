/*
  Warnings:

  - A unique constraint covering the columns `[sub_module_action_id,sub_module_id]` on the table `SubModulePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubModulePermission_sub_module_action_id_sub_module_id_key" ON "SubModulePermission"("sub_module_action_id", "sub_module_id");
