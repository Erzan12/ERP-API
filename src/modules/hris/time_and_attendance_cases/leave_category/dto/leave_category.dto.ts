import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLeaveCategory {
    @IsString()
    @ApiProperty({
        example: 'Sick Leave',
        description: 'Category name of leave category'
    })
    @IsNotEmpty()
    category_name: string
}

export class UpdateLeaveCategory {
    @IsString()
    @ApiProperty({
        example: 'Sick Leave',
        description: 'Category name of leave category'
    })
    @IsOptional()
    category_name?: string

    @IsBoolean()
    @ApiProperty({
        example: 'true or false',
    description: 'The status of this Leave Category',
    })
    @IsOptional()
    is_active?: boolean;
}