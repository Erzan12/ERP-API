import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InterviewStage } from '@prisma/client';

export class InterviewAssignmentDto {
  @ApiProperty({
    example: 'd322a787-e823-4a16-8ef0-641196bb0ae0',
  })
  @IsUUID()
  employee_id: string;

  @ApiProperty({
    enum: ['initial', 'second', 'final'],
  })
  @IsEnum(InterviewStage)
  stage: InterviewStage;

  @ApiProperty({
    example: '2026-08-01T09:00:00Z',
  })
  @IsDateString()
  date_of_interview: string;

  @IsString()
  @IsOptional() // remark for the interviewer like a note why he/she will be helpfull for this interview e.g experience
  @ApiProperty({ example: '', description: 'The interviewees personal remark' })
  remarks: string = '';
}