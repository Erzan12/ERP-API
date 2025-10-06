import { ApiProperty } from '@nestjs/swagger';
import { 
         IsString,
         IsNotEmpty,
         IsArray,
         ArrayNotEmpty,
         IsInt,
         IsBoolean,
         IsOptional
} from 'class-validator';

export class CreateRolePermissionDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true }) // ✅ Make sure each string is not an empty string
    @ApiProperty({ example: '["read", "update", "create", "delete"]', description: 'Assign permissions to role, also can add multiple permissions at once' })
    @ArrayNotEmpty()
    action: string[];

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the Sub Module' })
    sub_module_id: number;

    // @IsInt()
    // @IsOptional()
    // @ApiProperty({ example: 1, description: 'ID of the Module' })
    // module_id: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: 'ID of the Role' })
    role_id: number;
}