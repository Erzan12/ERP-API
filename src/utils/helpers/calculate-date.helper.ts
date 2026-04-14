import { addMonths, isAfter } from 'date-fns';
import { STAGE_RULES } from '../constants/evaluation.constants';

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
    return "complete";
  }

  const hireDate = evaluation.employee?.hire_date;
  if (!hireDate) return "pending";

  let deadline: Date;

  //employee hire date base
  // if (evaluation.stage === "third_month_evaluation") {
  //   deadline = addMonths(hireDate, 3);

  //probation date is adjustable and is not based on hire date of employee
  if (evaluation.stage === "third_month_evaluation") {
    deadline = new Date(evaluation.probation_date);
  } else if ( evaluation.stage === "fifth_month_evaluation") {
    deadline = addMonths(hireDate, 5);
  } else {
    return "pending";
  }

  if (now > deadline) {
    return "overdue";
  } else {
    return "pending";
  }
}
