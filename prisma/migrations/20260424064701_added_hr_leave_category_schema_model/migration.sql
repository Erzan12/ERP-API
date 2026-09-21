-- CreateTable
CREATE TABLE "HrLeaveCategory" (
    "id" UUID NOT NULL,
    "category_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrLeaveCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HrLeaveCategory" ADD CONSTRAINT "HrLeaveCategory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrLeaveCategory" ADD CONSTRAINT "HrLeaveCategory_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
