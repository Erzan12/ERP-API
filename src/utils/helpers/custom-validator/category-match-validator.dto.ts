import { EmployeeType } from "@prisma/client";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'CategoryMatch', async: false })
export class CategoryMatchValidator implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const obj = args.object as any;

        if (!obj.department_group) return false;

        if (obj.department_group === EmployeeType.sea_based) {
            return !!obj.sea_category && !obj.land_category;
        }

        if (obj.department_group === EmployeeType.land_based) {
            return !!obj.land_category && !obj.sea_category;
        }

        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Category must match department_group (sea vs land)';
    }
}