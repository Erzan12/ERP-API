-- CreateTable
CREATE TABLE "CareerPosting" (
    "id" UUID NOT NULL,
    "position_id" UUID NOT NULL,
    "slots" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "user_location_id" UUID NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "published_on" TIMESTAMP(3),
    "employment_type" TEXT NOT NULL,
    "employee_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareerPosting_position_id_idx" ON "CareerPosting"("position_id");

-- CreateIndex
CREATE INDEX "CareerPosting_department_id_idx" ON "CareerPosting"("department_id");

-- CreateIndex
CREATE INDEX "CareerPosting_user_location_id_idx" ON "CareerPosting"("user_location_id");

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPosting" ADD CONSTRAINT "CareerPosting_user_location_id_fkey" FOREIGN KEY ("user_location_id") REFERENCES "UserLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
