//updated dto with transformer 
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RolePermissionInput {
  @IsInt()
  role_id: number;

  @IsInt()
  sub_module_id: number;

  @IsInt()
  module_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  action: string[];
}

export class CreatePermissionTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  company_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // validate each item is an integer
  department_ids: number[]; //permission template can be applied to multiple departments

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionInput)
  @ArrayNotEmpty()
  rolePermissionIds: RolePermissionInput[];
}

// import {
//     IsString,
//     IsInt,
//     IsNotEmpty,
//     IsArray,
//     ArrayNotEmpty
// } from 'class-validator';

// export class CreatePermissionTemplateDto {
//     @IsString()
//     @IsNotEmpty()
//     name: string;

//     @IsInt()
//     @IsNotEmpty()
//     departmentId: number;

//     @IsArray()
//     @ArrayNotEmpty()
//     @IsNotEmpty()
//     @IsInt({ each: true }) //validate each item in array is an integer
//     companyIds: number[];

//     @IsArray()
//     @ArrayNotEmpty()
//     rolePermissionIds: { role_id: number, sub_module_id: number, module_id: number, action: string }[];
// }