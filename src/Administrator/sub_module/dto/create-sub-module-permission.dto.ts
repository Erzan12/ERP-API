import { 
        IsArray,
        ArrayNotEmpty,
        IsString,
        IsInt,
        IsNotEmpty,
} from 'class-validator';

export class CreateSubModulePermissionDto {
    @IsString({each:true})
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    action: string[];

    @IsInt()
    @IsNotEmpty()
    sub_module_id: number;
}