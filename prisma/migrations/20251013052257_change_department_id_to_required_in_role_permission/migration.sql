/*
  Warnings:

  - Made the column `department_id` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_department_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" ALTER COLUMN "department_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
