import { IsString,
         IsInt,
         IsNotEmpty
} from 'class-validator';

export class CreateSubModuleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    module_id: number;
}