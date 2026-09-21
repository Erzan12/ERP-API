-- CreateTable
CREATE TABLE "HrErCaseTypeOfOffense" (
    "id" UUID NOT NULL,
    "type_of_offense" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseTypeOfOffense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HrErCaseTypeOfOffense" ADD CONSTRAINT "HrErCaseTypeOfOffense_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseTypeOfOffense" ADD CONSTRAINT "HrErCaseTypeOfOffense_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
