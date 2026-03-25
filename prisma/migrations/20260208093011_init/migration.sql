-- CreateTable
CREATE TABLE "Person" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "suffix" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "email" TEXT,
    "contact_no" TEXT,
    "civil_status" TEXT NOT NULL DEFAULT 'single',
    "home_address" TEXT,
    "city_provice" TEXT,
    "nationality" TEXT,
    "country" TEXT,
    "zip_code" TEXT,
    "emergency_contact_person" TEXT,
    "emergency_contact_number" TEXT,
    "anonymization_preferences" JSONB,
    "other_person_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAddress" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "email_address" TEXT NOT NULL,
    "email_type" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "password_reset" TEXT,
    "require_reset" INTEGER NOT NULL DEFAULT 1,
    "reports_to" INTEGER,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "security_questions" JSONB,
    "security_clearance_level" INTEGER,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "id" UUID NOT NULL,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_token" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "password_token" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "telephone_no" TEXT,
    "fax_no" TEXT,
    "company_tin" TEXT,
    "abbreviation" TEXT NOT NULL,
    "is_top_20000" INTEGER NOT NULL DEFAULT 0,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "division_head_id" TEXT,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "division_id" UUID NOT NULL,
    "sorting" INTEGER,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "department_head_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sorting" INTEGER,
    "department_id" UUID NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "position_id" UUID NOT NULL,
    "division_id" UUID NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "salary" DECIMAL(65,30) NOT NULL,
    "pay_frequency" TEXT NOT NULL,
    "employment_status_id" UUID NOT NULL,
    "monthly_equivalent_salary" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "archive_date" TIMESTAMP(3),
    "other_employee_data" JSONB,
    "corporate_rank_id" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentStatus" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "role_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "role_name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "sub_module_permission_id" UUID NOT NULL,
    "sub_module_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "position_id" UUID,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "user_role_id" UUID NOT NULL,
    "role_permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "user_email" TEXT,
    "employee_id" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "change_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ip_address" TEXT,
    "user_agent" TEXT,
    "endpoint" TEXT,
    "http_method" TEXT,
    "status_code" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "department_id" UUID,
    "session_id" TEXT,
    "request_id" TEXT,
    "severity" TEXT DEFAULT 'INFO',
    "compliance_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModule" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "module_id" UUID NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModuleAction" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubModuleAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModulePermission" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "sub_module_action_id" UUID NOT NULL,
    "sub_module_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "stat" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionTemplateDepartment" (
    "id" UUID NOT NULL,
    "permission_template_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "position_id" UUID,

    CONSTRAINT "PermissionTemplateDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionTemplateRolePermission" (
    "id" UUID NOT NULL,
    "permission_template_id" UUID NOT NULL,
    "role_permission_id" UUID NOT NULL,
    "permission_template_department_id" UUID NOT NULL,

    CONSTRAINT "PermissionTemplateRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionTemplateToRole" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PermissionTemplateToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE INDEX "Person_last_name_first_name_idx" ON "Person"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "EmailAddress_person_id_idx" ON "EmailAddress"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_employee_id_key" ON "User"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_person_id_idx" ON "User"("person_id");

-- CreateIndex
CREATE INDEX "User_employee_id_idx" ON "User"("employee_id");

-- CreateIndex
CREATE INDEX "UserLocation_location_name_idx" ON "UserLocation"("location_name");

-- CreateIndex
CREATE INDEX "UserLocation_address_idx" ON "UserLocation"("address");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_user_token_key" ON "UserToken"("user_token");

-- CreateIndex
CREATE INDEX "UserToken_user_id_idx" ON "UserToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_password_token_key" ON "PasswordResetToken"("password_token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_user_id_idx" ON "PasswordResetToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_abbreviation_key" ON "Company"("abbreviation");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_abbreviation_idx" ON "Company"("abbreviation");

-- CreateIndex
CREATE INDEX "Division_name_idx" ON "Division"("name");

-- CreateIndex
CREATE INDEX "Division_division_head_id_idx" ON "Division"("division_head_id");

-- CreateIndex
CREATE INDEX "Department_division_id_idx" ON "Department"("division_id");

-- CreateIndex
CREATE INDEX "Position_department_id_idx" ON "Position"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_person_id_key" ON "Employee"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employee_id_key" ON "Employee"("employee_id");

-- CreateIndex
CREATE INDEX "Employee_department_id_idx" ON "Employee"("department_id");

-- CreateIndex
CREATE INDEX "Employee_company_id_idx" ON "Employee"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentStatus_code_key" ON "EmploymentStatus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "UserRole_user_id_idx" ON "UserRole"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_id_key" ON "UserRole"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "RolePermission_role_id_idx" ON "RolePermission"("role_id");

-- CreateIndex
CREATE INDEX "RolePermission_department_id_idx" ON "RolePermission"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_role_permission" ON "RolePermission"("role_id", "sub_module_permission_id", "action");

-- CreateIndex
CREATE INDEX "UserPermission_user_id_idx" ON "UserPermission"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_role_id_role_permission_id_key" ON "UserPermission"("user_role_id", "role_permission_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_employee_id_idx" ON "audit_logs"("employee_id");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resource_id_idx" ON "audit_logs"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_department_id_idx" ON "audit_logs"("department_id");

-- CreateIndex
CREATE INDEX "audit_logs_session_id_idx" ON "audit_logs"("session_id");

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "audit_logs"("success");

-- CreateIndex
CREATE INDEX "Module_name_idx" ON "Module"("name");

-- CreateIndex
CREATE INDEX "SubModule_module_id_idx" ON "SubModule"("module_id");

-- CreateIndex
CREATE INDEX "SubModulePermission_sub_module_id_idx" ON "SubModulePermission"("sub_module_id");

-- CreateIndex
CREATE INDEX "PermissionTemplate_name_idx" ON "PermissionTemplate"("name");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_permission_template_id_idx" ON "PermissionTemplateDepartment"("permission_template_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_position_id_idx" ON "PermissionTemplateDepartment"("position_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateDepartment_user_id_idx" ON "PermissionTemplateDepartment"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateDepartment_permission_template_id_departm_key" ON "PermissionTemplateDepartment"("permission_template_id", "department_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_permission_template_id_idx" ON "PermissionTemplateRolePermission"("permission_template_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_permission_template_depart_idx" ON "PermissionTemplateRolePermission"("permission_template_department_id");

-- CreateIndex
CREATE INDEX "PermissionTemplateRolePermission_role_permission_id_idx" ON "PermissionTemplateRolePermission"("role_permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplateRolePermission_permission_template_id_rol_key" ON "PermissionTemplateRolePermission"("permission_template_id", "role_permission_id", "permission_template_department_id");

-- CreateIndex
CREATE INDEX "_PermissionTemplateToRole_B_index" ON "_PermissionTemplateToRole"("B");

-- AddForeignKey
ALTER TABLE "EmailAddress" ADD CONSTRAINT "EmailAddress_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "EmploymentStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "SubModulePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "SubModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "RolePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModule" ADD CONSTRAINT "SubModule_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModulePermission" ADD CONSTRAINT "SubModulePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "SubModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModulePermission" ADD CONSTRAINT "SubModulePermission_sub_module_action_id_fkey" FOREIGN KEY ("sub_module_action_id") REFERENCES "SubModuleAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplate" ADD CONSTRAINT "PermissionTemplate_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateDepartment" ADD CONSTRAINT "PermissionTemplateDepartment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_id_fkey" FOREIGN KEY ("permission_template_id") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "RolePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionTemplateRolePermission" ADD CONSTRAINT "PermissionTemplateRolePermission_permission_template_depar_fkey" FOREIGN KEY ("permission_template_department_id") REFERENCES "PermissionTemplateDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionTemplateToRole" ADD CONSTRAINT "_PermissionTemplateToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "PermissionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionTemplateToRole" ADD CONSTRAINT "_PermissionTemplateToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
