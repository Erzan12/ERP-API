//updated dto with transformer 
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// class RolePermissionInput {
//   @IsInt()
//   @IsNotEmpty()
//   @ApiProperty({ example: 1, description: 'ID of the Role' })
//   role_id: number;

//   @IsInt()
//   @IsNotEmpty()
//   @ApiProperty({ example: 1, description: 'ID of the Sub Module' })
//   sub_module_id: number;

//   @IsArray()
//   @ArrayNotEmpty()
//   @IsString({ each: true })
//   @ApiProperty({ example: "create, update, delete, read ", description: 'ID of the Department' })
//   action: string[];

//   @IsInt()
//   @IsNotEmpty()
//   @ApiProperty({ example: 1, description: 'ID of the Department' })
//   department_id: number;

//   @IsInt()
//   @IsNotEmpty()
//   @IsOptional()
//   @ApiProperty({ example: 1, description: 'ID of the Position' })
//   position_id?: number;
// }

export class CreatePermissionTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Name of the Permission Template' })
  name: string;

  // @IsInt()
  // @IsNotEmpty()
  // company_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // validate each item is an integer
  @ApiProperty({ example: 1, description: 'ID of the department for this permission template' })
  department_id: number; //permission template can be applied to multiple departments

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => RolePermissionInput)
  // @ArrayNotEmpty()
  // role_permission_ids: RolePermissionInput[];
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // validate each item is an integer
  @ApiProperty({ example: 1, description: 'ID of the role permissions that will be assigned to this template' })
  role_permission_ids: number[]; //permission template can be applied to multiple departments
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