import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class UnassignSubmodulePermissionsDto {
    @IsInt()
    @IsNotEmpty()
    sub_module_id: number;

    @IsInt({ each: true })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @IsArray()
    sub_module_permission_id: number[];
}