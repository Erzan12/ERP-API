import { EvaluationStage } from '@prisma/client';
import { addMonths } from 'date-fns';

export function calculateDueDate(hireDate: Date, stage: EvaluationStage) {
  switch (stage) {
    case 'third_month_evaluation':
      return addMonths(hireDate, 3);

    case 'fifth_month_evaluation':
      return addMonths(hireDate, 5);

    default:
      throw new Error('Invalid evaluation stage');
  }
}