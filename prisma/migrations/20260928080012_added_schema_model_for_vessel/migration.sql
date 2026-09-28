-- CreateEnum
CREATE TYPE "VesselType" AS ENUM ('vessel_cargo', 'tugboat', 'barge');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "vessel_id" UUID;

-- CreateTable
CREATE TABLE "Vessel" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "photo" TEXT,
    "name" TEXT NOT NULL,
    "type" "VesselType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VesselDetails" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "price_sold" TEXT,
    "price_paid" TEXT,
    "length_loa" TEXT,
    "length_lbp" TEXT,
    "breadth" TEXT,
    "depth" TEXT,
    "draft" TEXT,
    "year_built" TEXT,
    "builder" TEXT,
    "place_built" TEXT,
    "jap_dwt" TEXT,
    "bale_capacity" TEXT,
    "grain_capacity" TEXT,
    "hatch_size" TEXT,
    "hatch_type" TEXT,
    "hull_type" TEXT,
    "hull_number" TEXT,
    "fuel_type" TEXT,
    "gearbox_ratio" TEXT,
    "year_last_drydocked" TEXT,
    "place_last_drydocked" TEXT,
    "phil_dwt" DECIMAL(65,30),
    "gross_tonnage" TEXT,
    "net_tonnage" TEXT,
    "main_engine" TEXT,
    "main_engine_rating" TEXT,
    "main_engine_actual_rating" TEXT,
    "model_serial_no" TEXT,
    "estimated_fuel_consumption" TEXT,
    "bow_thrusters" TEXT,
    "propeller" TEXT,
    "call_sign" TEXT,
    "imo_no" TEXT,
    "mmsi_no" TEXT,
    "maiden_voyage" TIMESTAMP(3),
    "min_main_engine_rating" DOUBLE PRECISION,
    "max_main_engine_rating" DOUBLE PRECISION,
    "auxillary_engine_1_rating" DOUBLE PRECISION,
    "auxillary_engine_2_rating" DOUBLE PRECISION,
    "auxillary_engine_3_rating" DOUBLE PRECISION,
    "generator_set_rating" DOUBLE PRECISION,
    "crane_rating" DOUBLE PRECISION,
    "is_coupled_generator" BOOLEAN,
    "min_service_knots" DOUBLE PRECISION,
    "max_service_knots" DOUBLE PRECISION,
    "bank_account_number" TEXT,
    "bank_account_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vessel_company_id_idx" ON "Vessel"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "VesselDetails_vessel_id_key" ON "VesselDetails"("vessel_id");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselDetails" ADD CONSTRAINT "VesselDetails_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
