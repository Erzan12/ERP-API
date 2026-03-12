import { 
    IsBoolean, 
    IsEnum, 
    IsInt, 
    IsNotEmpty, 
    IsString 
} from "class-validator";
import { 
    CareerPostingStatus, 
    EmployeeType, 
    EmploymentType 
} from "src/utils/decorators/global.enums.decorator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCareerPostingDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Position PK UUID',
        description: 'The PK uuid of the position',
    })
    position_id: number;

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

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Deparment PK UUID',
        description: 'The PK uuid of the department',
    })
    department_id: number;

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

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User Location PK UUID',
        description: 'The PK uuid of the user location',
    })
    user_location_id: number;
}
