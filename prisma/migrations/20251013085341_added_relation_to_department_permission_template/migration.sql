/*
  Warnings:

  - You are about to drop the column `companyId` on the `PermissionTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PermissionTemplate" DROP CONSTRAINT "PermissionTemplate_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."PermissionTemplate" DROP COLUMN "companyId";
