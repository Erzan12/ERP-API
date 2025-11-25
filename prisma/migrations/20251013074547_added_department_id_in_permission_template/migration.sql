/*
  Warnings:

  - Added the required column `department_id` to the `PermissionTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PermissionTemplate" ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."PermissionTemplate" ADD CONSTRAINT "PermissionTemplate_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
