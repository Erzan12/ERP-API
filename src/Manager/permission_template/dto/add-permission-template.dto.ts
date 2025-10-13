import { IsNotEmpty, IsInt, IsArray, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class AddPermissionToExistingRoleDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  role_ids: number[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  permission_template_id: number;
}

export class AddPermissionToExistingUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  user_ids: number[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  permission_template_id: number;
}