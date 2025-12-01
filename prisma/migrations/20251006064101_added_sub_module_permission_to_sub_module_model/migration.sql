/*
  Warnings:

  - Made the column `sub_module_id` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" ALTER COLUMN "sub_module_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "public"."SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
