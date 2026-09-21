/*
  Warnings:

  - A unique constraint covering the columns `[user_id,sub_module_permission_id]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PermissionSource" AS ENUM ('role', 'direct');

-- DropIndex
DROP INDEX "UserPermission_user_role_id_role_permission_id_key";

-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "source" "PermissionSource",
ADD COLUMN     "sub_module_permission_id" UUID,
ALTER COLUMN "role_permission_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_id_sub_module_permission_id_key" ON "UserPermission"("user_id", "sub_module_permission_id");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "SubModulePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
