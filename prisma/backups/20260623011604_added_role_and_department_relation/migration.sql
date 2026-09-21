/*
  Warnings:

  - You are about to drop the column `department_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `role_name` on the `RolePermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id,sub_module_permission_id]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_department_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_position_id_fkey";

-- DropIndex
DROP INDEX "RolePermission_department_id_idx";

-- DropIndex
DROP INDEX "unique_role_permission";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "department_id" UUID;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "department_id",
DROP COLUMN "position_id",
DROP COLUMN "role_name";

-- CreateIndex
CREATE INDEX "Role_department_id_idx" ON "Role"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_sub_module_permission_id_key" ON "RolePermission"("role_id", "sub_module_permission_id");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
