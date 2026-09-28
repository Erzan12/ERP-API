import { Prisma } from '@prisma/client';
import { computeEvaluationStatus } from 'src/utils/helpers/calculate-date.helper';
import { computeOverallStatus } from 'src/utils/helpers/compute-overall-status.helper';

export type Evaluation = Prisma.HrEmployeeEvaluationGetPayload<{
  include: {
    employee: {
      select: {
        id: true;
        employment_type: true;
        employee_type: true;
        hire_date: true;
        company: {
          select: {
            id: true;
            name: true;
            abbreviation: true;
          };
        };
        department: {
          select: { id: true; name: true };
        };
        person: {
          select: { first_name: true; last_name: true };
        };
        position: {
          select: { id: true; name: true };
        };
      };
    };
    evaluator: {
      select: {
        id: true;
        person: { select: { first_name: true; last_name: true } };
      };
    };
  };
}>;

export type ProcessedEvaluation = Evaluation & {
  stage_status: ReturnType<typeof computeEvaluationStatus>;
  overall_status: ReturnType<typeof computeOverallStatus>;
  employeeId: string;
};
