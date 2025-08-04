import { IsString, IsInt, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRolePermissionsDto {
    @IsInt()
    @IsNotEmpty()
    role_id: number;

    @IsString({ each: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    action_updates: {
        currentAction: string;
        newAction: string;
    }[];
}