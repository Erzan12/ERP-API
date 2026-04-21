import { addMonths } from 'date-fns';
import { EvaluationStageStatus, STAGE_RULES } from '../constants/evaluation.constant';
import { EvaluationStage } from '@prisma/client';

export function getExpectedDueDate(hireDate: Date, stage: keyof typeof STAGE_RULES) {
  const months = STAGE_RULES[stage];
  return addMonths(hireDate, months);
}

// export function computeEvaluationStatus(evaluation: any, now = new Date()) {
//   if (evaluation.completed_at) {
//     return "completed";
//   }

//   if (now > evaluation.due_date) {
//     return "overdue";
//   }

//   return "pending";
// }

export function computeEvaluationStatus(evaluation: any, now = new Date()) {
  if (evaluation.completed_at) {
    return EvaluationStageStatus.COMPLETE
  }

  const hireDate = evaluation.employee?.hire_date;
  if (!hireDate) return EvaluationStageStatus.PENDING;

  let deadline: Date;

  //employee hire date base
  // if (evaluation.stage === "third_month_evaluation") {
  //   deadline = addMonths(hireDate, 3);

  //probation date is adjustable and is not based on hire date of employee
  if (evaluation.stage === EvaluationStage.third_month_evaluation) {
    deadline = new Date(evaluation.probation_date, 3);
    // deadline = addMonths(hireDate, 3);
  } else if ( evaluation.stage === EvaluationStage.fifth_month_evaluation) {
    deadline = addMonths(hireDate, 5);
  } else {
    return EvaluationStageStatus.PENDING;
  }

  if (now > deadline) {
    return EvaluationStageStatus.OVERDUE;
  } else {
    return EvaluationStageStatus.PENDING;
  }
}
