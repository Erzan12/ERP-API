/*
  Warnings:

  - You are about to drop the column `performanceRating` on the `HrPerformanceCompetency` table. All the data in the column will be lost.
  - Changed the type of `rating` on the `HrPerformanceEvaluationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HrPerformanceCompetency" DROP COLUMN "performanceRating";

-- AlterTable
ALTER TABLE "HrPerformanceEvaluationDetails" DROP COLUMN "rating",
ADD COLUMN     "rating" "PerformanceRating" NOT NULL;
