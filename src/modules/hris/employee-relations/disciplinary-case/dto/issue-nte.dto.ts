import { IsArray, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class IssueNteDto {
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  reviewerIds: string[];
}
