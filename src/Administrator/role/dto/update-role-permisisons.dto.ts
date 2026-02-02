import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRolePermissionsDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: '1' , description: 'The ID of the Role you want to update or add new permission'})
    role_id: number;

    @IsString({ each: true })
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ example: '["read", "update", "delete", "create"]', description: 'User can add or update new permission for a current role'})
    @ArrayNotEmpty()
    action_updates: {
        currentAction: string;
        newAction: string;
    }[];
}