import { ApiProperty } from "@nestjs/swagger";
import { PerformanceRating } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { EmployeeType, LandBasedCategory, SeaBasedCategory } from "@prisma/client";
import { CategoryMatchValidator } from "src/utils/helpers/custom-validator/cateogory-match-validator.dto";

export class CreatePerformanceCompetencyDto {

    @IsOptional()
    @Validate(CategoryMatchValidator)
    private readonly _categoryCheck: any;

    @IsNotEmpty()
    @IsEnum(EmployeeType, {
        message: 'Valid inputs are: land_based and sea_based'
        // message: 'If selected Land based group valid inputs are: rank_and_file and managerial_and_supervisory. If selected Sea based group valid inputs are: all_ranks, all_officers and top_2_master_chief_engineer.'
    })
    @Type(() => String)
    @ApiProperty({
        enum: EmployeeType,
        example: EmployeeType.land_based,
        description: 'The deparment group of the employee'
    })
    department_group: EmployeeType;

    @IsOptional()
    @IsEnum(SeaBasedCategory, {
        message: 'Valid sea categories: all_ranks, all_officers, top_2_master_chief_engineer'
    })
    @Type(() => String)
    @ApiProperty({
        enum: SeaBasedCategory,
        required: false
    })
    sea_category?: SeaBasedCategory;

    @IsOptional()
    @IsEnum(LandBasedCategory, {
        message: 'Valid land categories: rank_and_file, managerial_and_supervisory'
    })
    @Type(() => String)
    @ApiProperty({
        enum: LandBasedCategory,
        required: false
    })
    land_category?: LandBasedCategory;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Name or Title of the performance competency',
        description: 'The name of the performance competency'
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Detail or description of this performance competency',
        description: 'Add description for this performance competence'
    })
    description: string;

    @IsInt()
    @IsOptional()
    @ApiProperty({
        example: 'Highest rate of this performance competency from 1-5',
        description: 'Highest rate of this performance competency from 1-5'
    })
    highest_score_limit?: number;
}

export class UpdatePerformanceCompetencyDto {

    @IsOptional()
    @Validate(CategoryMatchValidator)
    private readonly _categoryCheck: any;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(EmployeeType, {
        message: 'Valid inputs are: land_based and sea_based'
        // message: 'If selected Land based group valid inputs are: rank_and_file and managerial_and_supervisory. If selected Sea based group valid inputs are: all_ranks, all_officers and top_2_master_chief_engineer.'
    })
    @Type(() => String)
    @ApiProperty({
        enum: EmployeeType,
        example: EmployeeType.land_based,
        description: 'The deparment group of the employee'
    })
    department_group?: EmployeeType;

    @IsOptional()
    @IsEnum(SeaBasedCategory, {
        message: 'Valid sea categories: all_ranks, all_officers, top_2_master_chief_engineer'
    })
    @ApiProperty({
        enum: SeaBasedCategory,
        required: false
    })
    sea_category?: SeaBasedCategory;

    @IsOptional()
    @IsEnum(LandBasedCategory, {
        message: 'Valid land categories: rank_and_file, managerial_and_supervisory'
    })
    @ApiProperty({
        enum: LandBasedCategory,
        required: false
    })
    land_category?: LandBasedCategory;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Name or Title of the performance competency',
        description: 'The name of the performance competency'
    })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Detail or description of this performance competency',
        description: 'Add description for this performance competence'
    })
    description?: string;

    @IsInt()
    @IsOptional()
    @ApiProperty({
        example: 'Rate from 1 to 5, 5 is highest 1 is lowest',
        description: 'Highest rate of this performance competency'
    })
    highest_score_limit?: number;
}