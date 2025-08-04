import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class UnassignRolePermissionDto {
    @IsInt()
    @IsNotEmpty()
    sub_module_id: number;

    @IsInt({ each: true })
    @IsArray()
    @ArrayNotEmpty()
    role_permission_id: number[];
}