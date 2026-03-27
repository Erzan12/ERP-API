import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';
export declare class CreateEmployeeWithDetailsDto {
    person: CreatePersonDto;
    employee: CreateEmployeeDto;
}
export declare class UpdateEmployeeWithDetailsDto {
    person: UpdatePersonDto;
    employee: UpdateEmployeeDto;
}
