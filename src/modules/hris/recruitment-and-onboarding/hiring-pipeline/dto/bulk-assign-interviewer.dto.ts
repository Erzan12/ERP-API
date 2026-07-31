import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { InterviewAssignmentDto } from './interview-assignment.dto';
import { Type } from 'class-transformer';

export class BulkAssignInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Applicant uuid',
    description: 'The uuid of the applicant',
  })
  applicant_id: string;

  @IsArray()
  @ArrayMinSize(1)
  // @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'List of interview assignments for the applicant.',
    type: [InterviewAssignmentDto],
    example: [
      {
        employee_id: 'EMP-UUID',
        stage: 'initial',
        date_of_interview: '2026-08-01T09:00:00.000Z',
        remarks: 'Initial HR screening.',
      },
      {
        employee_id: 'EMP-UUID',
        stage: 'second',
        date_of_interview: '2026-08-03T10:00:00.000Z',
        remarks: 'Technical interview.',
      },
      {
        employee_id: 'EMP-UUID',
        stage: 'final',
        date_of_interview: '2026-08-05T01:00:00.000Z',
        remarks: 'Final interview with the department head.',
      },
    ],
  })
  @Type(() => InterviewAssignmentDto)
  interviews: InterviewAssignmentDto[]; //order: Initial -> Second -> Final

  // @IsDateString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: '',
  //   description: 'The date of interview of the applicant',
  // })
  // date_of_interview: string;
}
