/*
  Warnings:

  - You are about to drop the column `status` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `stat` on the `SubModulePermission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."RolePermission" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."SubModule" ADD COLUMN     "stat" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."SubModulePermission" DROP COLUMN "stat",
ADD COLUMN     "added_sub_mod_permission_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."AddedSubModPermission" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AddedSubModPermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SubModulePermission" ADD CONSTRAINT "SubModulePermission_added_sub_mod_permission_id_fkey" FOREIGN KEY ("added_sub_mod_permission_id") REFERENCES "public"."AddedSubModPermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
