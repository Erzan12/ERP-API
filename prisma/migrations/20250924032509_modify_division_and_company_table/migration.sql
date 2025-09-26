-- make nullable (correct use of DROP NOT NULL)
ALTER TABLE "Company" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "Company" ALTER COLUMN "address" DROP NOT NULL;
ALTER TABLE "Company" ALTER COLUMN "telephone_no" DROP NOT NULL;
ALTER TABLE "Division" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "Division" ALTER COLUMN "division_head_id" DROP NOT NULL;

-- remove default values (optional fields don't need them anymore)
ALTER TABLE "Company" ALTER COLUMN "address" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "telephone_no" DROP DEFAULT;

-- convert `is_top_20000` from BOOLEAN → INTEGER
ALTER TABLE "Company" ALTER COLUMN "is_top_20000" DROP DEFAULT;

-- correct conversion using CASE WHEN to preserve NULLs and cast properly
ALTER TABLE "Company"
ALTER COLUMN "is_top_20000" TYPE INTEGER
USING CASE
  WHEN "is_top_20000" IS NULL THEN NULL
  WHEN "is_top_20000" = TRUE THEN 1
  ELSE 0
END;

-- rename column (PostgreSQL syntax is correct)
ALTER TABLE "Company" RENAME COLUMN "company_code" TO "company_tin";

-- drop unwanted column
ALTER TABLE "Company" DROP COLUMN "tin_no";

-- remove default from renamed column
ALTER TABLE "Company" ALTER COLUMN "company_tin" DROP DEFAULT;
