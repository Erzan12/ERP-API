import { HrPerformanceEvaluationDetails, PerformanceRating } from "@prisma/client";

const ratingToScore: Record<PerformanceRating, number> = {
  unsatisfactory: 1,
  needs_improvement: 2,
  meets_expectations: 3,
  exceed_expectations: 4,
  exceptional: 5,
};

function getScore(rating: PerformanceRating): number {
  return ratingToScore[rating];
}

function computeOverall(details: HrPerformanceEvaluationDetails[]): number {
  const scores = details.map(d => getScore(d.rating));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg); // or keep decimal if needed
}

