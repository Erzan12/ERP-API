import { CreatePersonDto } from "src/HR/person/dto/create-person.dto";
import { CreateEmployeeDto } from "./create-employee.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeWithDetailsDto {
    
    //wrapper dto for nested dto
    @ApiProperty({ type: () => CreatePersonDto }) // to load or map the example value in createPersonDto ApiProperty
    @ValidateNested()
    @Type(() => CreatePersonDto) 
    person: CreatePersonDto;

    @ApiProperty({ type: () => CreateEmployeeDto }) // to load or map the example value in createEmpoyeeDto ApiProperty
    @ValidateNested()
    @Type(() => CreateEmployeeDto)
    employee: CreateEmployeeDto;
}