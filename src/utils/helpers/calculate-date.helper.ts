import { addMonths, isAfter } from 'date-fns';
import { STAGE_RULES } from '../constants/evaluation.constants';

export function getExpectedDueDate(hireDate: Date, stage: keyof typeof STAGE_RULES) {
  const months = STAGE_RULES[stage];
  return addMonths(hireDate, months);
}

export function computeStatus(evaluation: any) {
  if (evaluation.completed_at) return 'completed';

  if (isAfter(new Date(), new Date(evaluation.due_date))) {
    return 'overdue';
  }

  return 'pending';
}
