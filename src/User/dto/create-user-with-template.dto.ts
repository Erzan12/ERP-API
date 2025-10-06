import {
    IsNotEmpty,
    IsInt,
    ValidateNested,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { UserDetailsDto } from '../dto/user-details.dto';

export class CreateUserWithTemplateDto {
  @ValidateNested()
  user_details: {
    employee_id: string;
    username: string;
    email: string;
    password: string;
  };

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  role_permission_ids?: number[]  // IDs from RolePermission
}
