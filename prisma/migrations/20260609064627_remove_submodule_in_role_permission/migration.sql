/*
  Warnings:

  - You are about to drop the column `sub_module_id` on the `RolePermission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "sub_module_id";
