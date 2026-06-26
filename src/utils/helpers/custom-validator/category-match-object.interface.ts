import { EmployeeType } from '@prisma/client';

export interface CategoryMatchObject {
  department_group: EmployeeType;
  sea_category?: unknown;
  land_category?: unknown;
}
