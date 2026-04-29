import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateLeaveRequestDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Employee UUID',
        description: 'The employee uuid PK'
    })
    employee_id: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: '2026-04-10',
        description: 'Date start of employee leave request'
    })
    date_from: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: '2026-04-10',
        description: 'Date end of the employee leave request'
    })
    date_to: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'I will go for vacation',
        description: 'The reason of employee leave request'
    })
    reason: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '09633263341',
        description: 'Telephone or cellphone number of employee'
    })
    contact_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Hotel California',
        description: 'The employee address while on leave'
    })
    address_on_leave: string;
    
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User UUID for reliver while on leave',
        description: 'The uuid of reliever user while employee is on leave'
    })
    reliever_id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User UUID for verifier of this leave request',
        description: 'The uuid of verifier user for this leave request'
    })
    verifier_id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User UUID for leave request approver',
        description: 'The uuid of approver user for this user leave request'
    })
    approver_id: string;
}

export class RecordLeaveDatesDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: '2026-04-10',
    })
    leave_date: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Leave type/category UUID PK'
    })
    leave_type: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 1.0
    })
    fraction: number;
}

export class CreateLeaveRequestWithDetailsDto {
    @ApiProperty({ type: () => CreateLeaveRequestDto })
    @ValidateNested()
    @Type(() => CreateLeaveRequestDto )
    leave_request: CreateLeaveRequestDto;

    @ApiProperty({ type: () => [RecordLeaveDatesDto] })
    @ValidateNested({each: true})
    @Type(() => RecordLeaveDatesDto)
    leave_dates: RecordLeaveDatesDto[];
}