-- CreateTable
CREATE TABLE "HrErCaseArticle" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrErCaseViolation" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "section" INTEGER NOT NULL,
    "behavior" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HrErCaseViolation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HrErCaseViolation_article_id_idx" ON "HrErCaseViolation"("article_id");

-- AddForeignKey
ALTER TABLE "HrErCaseArticle" ADD CONSTRAINT "HrErCaseArticle_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseArticle" ADD CONSTRAINT "HrErCaseArticle_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrErCaseViolation" ADD CONSTRAINT "HrErCaseViolation_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "HrErCaseArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
