import { EvaluationStage } from "@prisma/client";

export const STAGE_RULES = {
  third_month_evaluation: 3,
  fifth_month_evaluation: 5,
};

export const PREVIOUS_STAGE_MAP: Record<EvaluationStage, EvaluationStage | null> = {
  third_month_evaluation: null,
  fifth_month_evaluation: EvaluationStage.third_month_evaluation,
};

export enum EvaluationStageStatus {
  PENDING  = 'pending',
  OVERDUE  = 'overdue',
  COMPLETE = 'complete'
}