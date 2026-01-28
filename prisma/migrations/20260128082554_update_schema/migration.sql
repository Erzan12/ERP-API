/*
  Warnings:

  - A unique constraint covering the columns `[permission_template_id,role_permission_id,permission_template_department_id]` on the table `PermissionTemplateRolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EmailAddress" DROP CONSTRAINT "EmailAddress_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_person_id_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PermissionTemplateDepartment" DROP CONSTRAINT "PermissionTemplateDepartment_department_id_fkey";

-- DropForeignKey
ALTER TABLE "PermissionTemplateRolePermission" DROP CONSTRAINT "PermissionTemplateRolePermission_permission_template_depar_fkey";

-- DropForeignKey
ALTER TABLE "PermissionTemplateRolePermission" DROP CONSTRAINT "PermissionTemplateRolePermission_permission_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_department_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "SubModule" DROP CONSTRAINT "SubModule_module_id_fkey";

-- DropForeignKey
ALTER TABLE "SubModulePermission" DROP CONSTRAINT "SubModulePermission_sub_module_action_id_fkey";

-- DropForeignKey
ALTER TABLE "SubModulePermission" DROP CONSTRAINT "SubModulePermission_sub_module_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_person_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_role_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_user_id_fkey";

-- DropIndex
DROP INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key";

-- AlterTable
ALTER TABLE "UserLocation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_abbreviation_idx" ON "Company"("abbreviation");

-- CreateIndex
CREATE INDEX "Department_division_id_idx" ON "Department"("division_id");

-- CreateIndex
CREATE INDEX "Division_name_idx" ON "Division"("name");

-- CreateIndex
CREATE INDEX "Division_division_head_id_idx" ON "Division"("division_head_id");

-- CreateIndex
CREATE INDEX "EmailAddress_person_id_idx" ON "EmailAddress"("person_id");

-- CreateIndex
CREATE INDEX "Employee_department_id_idx" ON "Employee"("department_id");

-- CreateIndex
CREATE INDEX "Employee_company_id_idx" ON "Employee"("company_id");

-- CreateIndex
CREATE INDEX "Module_name_idx" ON "Module"("name");

-- CreateIndex
CREATE INDEX "PasswordResetToken_user_id_idx" ON "PasswordResetToken"("user_id");

-- CreateIndex
CREATE INDEX "PermissionTemplate_name_idx" ON "PermissionTemplate"("name");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_permission_template_id_idx" ON "PermissionTemplateDepartment"("permission_template_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_position_id_idx" ON "PermissionTemplateDepartment"("position_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_user_id_idx" ON "PermissionTemplateDepartment"("user_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_permission_template_id_idx" ON "PermissionTemplateRolePermission"("permission_template_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_permission_template_depart_idx" ON "PermissionTemplateRolePermission"("permission_template_department_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_role_permission_id_idx" ON "PermissionTemplateRolePermission"("role_permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key" ON "PermissionTemplateRolePermission"("permission_template_id", "role_permission_id", "permission_template_department_id");

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE INDEX "Person_last_name_first_name_idx" ON "Person"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "Position_department_id_idx" ON "Position"("department_id");

-- CreateIndex
CREATE INDEX "RolePermission_role_id_idx" ON "RolePermission"("role_id");

-- CreateIndex
CREATE INDEX "RolePermission_department_id_idx" ON "RolePermission"("department_id");

-- CreateIndex
CREATE INDEX "SubModule_module_id_idx" ON "SubModule"("module_id");

-- CreateIndex
CREATE INDEX "SubModulePermission_sub_module_id_idx" ON "SubModulePermission"("sub_module_id");

-- CreateIndex
CREATE INDEX "User_person_id_idx" ON "User"("person_id");

-- CreateIndex
CREATE INDEX "User_employee_id_idx" ON "User"("employee_id");

-- CreateIndex
CREATE INDEX "UserLocation_location_name_idx" ON "UserLocation"("location_name");

-- CreateIndex
CREATE INDEX "UserLocation_address_idx" ON "UserLocation"("address");

-- CreateIndex
CREATE INDEX "UserPermission_user_id_idx" ON "UserPermission"("user_id");

-- CreateIndex
CREATE INDEX "UserRole_user_id_idx" ON "UserRole"("user_id");

-- CreateIndex
CREATE INDEX "UserToken_user_id_idx" ON "UserToken"("user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModulePermission" ADD CONSTRAINT "SubModulePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "SubModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModulePermission" ADD CONSTRAINT "SubModulePermission_sub_module_action_id_fkey" FOREIGN KEY ("sub_module_action_id") REFERENCES "SubModuleAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "SubModulePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "RolePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModule" ADD CONSTRAINT "SubModule_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_depar_fkey" FOREIGN KEY ("permission_template_department_id") REFERENCES "PermissionTemplateDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAddress" ADD CONSTRAINT "EmailAddress_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
