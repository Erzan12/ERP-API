/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `SubModule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `SubModuleAction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `SubModulePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubModuleAction_action_key";

-- AlterTable
ALTER TABLE "SubModule" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "SubModuleAction" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "SubModulePermission" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_slug_key" ON "SubModule"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubModuleAction_slug_key" ON "SubModuleAction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubModulePermission_code_key" ON "SubModulePermission"("code");
