import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';

export class BulkAssignInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Applicant uuid',
    description: 'The uuid of the applicant',
  })
  applicant_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ApiProperty({ example: ['uuid-1', 'uuid-2', 'uuid-3'] })
  interviewer_ids: string[]; //order: Initial -> Second -> Final

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: 'The date of interview of the applicant',
  })
  date_of_interview: string;

  @IsString()
  @IsOptional() // remark for the interviewer like a note why he/she will be helpfull for this interview e.g experience
  @ApiProperty({ example: '', description: 'The interviewees personal remark' })
  remarks: string = '';
}
