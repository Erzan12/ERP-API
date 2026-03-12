import { 
    IsEnum, 
    IsInt, 
    IsNotEmpty, 
    IsString, 
    IsUUID
} from "class-validator";
import {  
    EmployeeType, 
    EmploymentType 
} from "src/utils/decorators/global.enums.decorator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCareerPostingDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Position PK UUID',
        description: 'The PK uuid of the position',
    })
    position_id: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 5,
        description: 'The number of slots for this position',
    })
    slots: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Manages the development team',
        description: 'The description of the position'
    })
    job_description: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Deparment PK UUID',
        description: 'The PK uuid of the department',
    })
    department_id: string;

    @IsString()
    @IsEnum(EmployeeType, { message: 'Employment type must be land_based or sea_based'})
    @Type(() => String)
    @ApiProperty({
        enum: EmployeeType,
        example: EmployeeType.LAND_BASED,
        description: 'The employee type of this career posting'
    })
    employee_type: EmployeeType;

    @IsString()
    @IsEnum(EmploymentType, { message: 'Employment type must be full_time or part_time'})
    @Type(() => String)
    @ApiProperty({
        enum: EmploymentType,
        example: EmploymentType.FULL_TIME,
        description: 'The employment type of this career posting'
    })
    employment_type: EmploymentType;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User Location PK UUID',
        description: 'The PK uuid of the user location',
    })
    user_location_id: string;
}
