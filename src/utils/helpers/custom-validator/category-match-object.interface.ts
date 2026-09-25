import { EmployeeType } from "src/generated/prisma/enums";

export interface CategoryMatchObject {
  department_group: EmployeeType;
  sea_category?: unknown;
  land_category?: unknown;
}
