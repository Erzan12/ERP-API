import { ApiProperty } from '@nestjs/swagger';
import { IsString,
         IsNotEmpty,
         IsOptional,
         IsInt,
 } from 'class-validator';


export class UpdateModuleDto {

    @IsNotEmpty()
    @IsInt()
    module_id: number;

    @IsString()
    @IsOptional()
    name: string;
}