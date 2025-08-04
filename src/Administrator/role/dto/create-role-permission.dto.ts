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
    @IsNotEmpty()
    @ArrayNotEmpty()
    action: string[];

    @IsInt()
    @IsNotEmpty()
    sub_module_id: number;

    @IsInt()
    @IsNotEmpty()
    module_id: number;

    @IsInt()
    @IsNotEmpty()
    role_id: number;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}