-- CreateTable
CREATE TABLE "SalaryGrade" (
    "id" UUID NOT NULL,
    "grade" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "level" INTEGER NOT NULL,
    "is_confidential" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SalaryGrade" ADD CONSTRAINT "SalaryGrade_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryGrade" ADD CONSTRAINT "SalaryGrade_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
