/*
  Warnings:

  - You are about to drop the column `user_role_permission` on the `UserPermission` table. All the data in the column will be lost.
  - You are about to drop the column `role_permission_id` on the `UserRole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_role_id,role_permission_id]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `AddedSubModPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Division` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `EmailAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `EmploymentStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PermissionTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Made the column `stat` on table `Position` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubModulePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `UserPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserPermission` table without a default value. This is not possible if the table is not empty.
  - Made the column `role_permission_id` on table `UserPermission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Made the column `role_id` on table `UserRole` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role_name` on table `UserRole` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserPermission" DROP CONSTRAINT "UserPermission_role_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_role_permission_id_fkey";

-- AlterTable
ALTER TABLE "public"."AddedSubModPermission" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Department" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Division" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."EmailAddress" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "corporate_rank_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."EmploymentStatus" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."PasswordResetToken" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."PermissionTemplate" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Person" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "contact_no" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Position" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "stat" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubModule" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubModulePermission" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserPermission" DROP COLUMN "user_role_permission",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role_permission_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserRole" DROP COLUMN "role_permission_id",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role_id" SET NOT NULL,
ALTER COLUMN "role_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserToken" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_role_id_role_permission_id_key" ON "public"."UserPermission"("user_role_id", "role_permission_id");

-- AddForeignKey
ALTER TABLE "public"."UserPermission" ADD CONSTRAINT "UserPermission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "public"."RolePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
