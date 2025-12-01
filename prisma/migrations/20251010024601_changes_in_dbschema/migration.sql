/*
  Warnings:

  - You are about to drop the column `added_sub_mod_permission_id` on the `SubModulePermission` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `must_reset_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AddedSubModPermission` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stat` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stat` on table `Department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Division` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `sub_module_action_id` to the `SubModulePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_division_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubModulePermission" DROP CONSTRAINT "SubModulePermission_added_sub_mod_permission_id_fkey";

-- DropIndex
DROP INDEX "public"."Company_name_key";

-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "abbreviation" SET DATA TYPE TEXT,
ALTER COLUMN "stat" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Department" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "stat" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Division" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Employee" ALTER COLUMN "division_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."SubModulePermission" DROP COLUMN "added_sub_mod_permission_id",
ADD COLUMN     "sub_module_action_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "is_active",
DROP COLUMN "must_reset_password",
ALTER COLUMN "password_reset" DROP DEFAULT,
ALTER COLUMN "require_reset" SET DEFAULT 1,
ALTER COLUMN "created_by" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."AddedSubModPermission";

-- CreateTable
CREATE TABLE "public"."SubModuleAction" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubModuleAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SubModulePermission" ADD CONSTRAINT "SubModulePermission_sub_module_action_id_fkey" FOREIGN KEY ("sub_module_action_id") REFERENCES "public"."SubModuleAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "public"."Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
