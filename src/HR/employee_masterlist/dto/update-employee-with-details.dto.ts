import { Type } from "class-transformer";
import { UpdateEmployeeDto } from "./update-employee.dto";
import { UpdatePersonDto } from "./update-person.dto";
import { ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEmployeeWithDetailsDto {
    @ApiProperty({ type: () => UpdatePersonDto })
    @ValidateNested()
    @Type(() => UpdatePersonDto)
    person: UpdatePersonDto;

    @ApiProperty({ type: () => UpdateEmployeeDto })
    @ValidateNested()
    @Type(() => UpdateEmployeeDto)
    employee: UpdateEmployeeDto;
}