/*
  Warnings:

  - You are about to drop the column `module_id` on the `PermissionTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `SubModule` table. All the data in the column will be lost.
  - You are about to drop the `_ModuleToPermissionTemplates` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `last_login` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `person_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."SubModule" DROP CONSTRAINT "SubModule_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_person_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleToPermissionTemplates" DROP CONSTRAINT "_ModuleToPermissionTemplates_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleToPermissionTemplates" DROP CONSTRAINT "_ModuleToPermissionTemplates_B_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ALTER COLUMN "position_id" DROP DEFAULT,
ALTER COLUMN "division_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."PermissionTemplate" DROP COLUMN "module_id";

-- AlterTable
ALTER TABLE "public"."SubModule" DROP COLUMN "department_id";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "last_login" SET NOT NULL,
ALTER COLUMN "last_login" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "created_by" SET DATA TYPE TEXT,
ALTER COLUMN "person_id" SET NOT NULL;

-- DropTable
DROP TABLE "public"."_ModuleToPermissionTemplates";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
