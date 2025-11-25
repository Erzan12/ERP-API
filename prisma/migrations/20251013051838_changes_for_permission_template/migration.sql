/*
  Warnings:

  - You are about to drop the column `company_id` on the `PermissionTemplate` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `PermissionTemplateDepartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_template_department_id` to the `PermissionTemplateRolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PermissionTemplate" DROP CONSTRAINT "PermissionTemplate_company_id_fkey";

-- AlterTable
ALTER TABLE "public"."PermissionTemplate" DROP COLUMN "company_id",
ADD COLUMN     "companyId" INTEGER;

-- AlterTable
ALTER TABLE "public"."PermissionTemplateDepartment" ADD COLUMN     "position_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."PermissionTemplateRolePermission" ADD COLUMN     "permission_template_department_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "position_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionTemplate" ADD CONSTRAINT "PermissionTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_depar_fkey" FOREIGN KEY ("permission_template_department_id") REFERENCES "public"."PermissionTemplateDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
