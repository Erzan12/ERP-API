-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_sub_module_permission_id_fkey";

-- AlterTable
ALTER TABLE "public"."RolePermission" ADD COLUMN     "sub_module_id" INTEGER,
ALTER COLUMN "sub_module_permission_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_permission_id_fkey" FOREIGN KEY ("sub_module_permission_id") REFERENCES "public"."SubModulePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_sub_module_id_fkey" FOREIGN KEY ("sub_module_id") REFERENCES "public"."SubModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
