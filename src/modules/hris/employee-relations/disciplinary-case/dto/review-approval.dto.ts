import { HrErApprovalStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewApprovalDto {
  @IsEnum(HrErApprovalStatus) status: 'APPROVED' | 'REVISE' | 'REJECTED';
  @IsOptional() 
  @IsString() 
  remarks?: string;
}