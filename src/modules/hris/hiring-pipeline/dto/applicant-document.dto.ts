import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicantDocumentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'RESUME',
    description: 'Type of document',
  })
  document_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'resume.pdf',
    description: 'File name',
  })
  file_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '/uploads/resume.pdf',
    description: 'File path',
  })
  file_path: string;
}
