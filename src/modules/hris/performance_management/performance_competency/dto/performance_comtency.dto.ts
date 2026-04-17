import { ApiProperty } from "@nestjs/swagger";
import { PerformanceRating } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { EmployeeType, LandBasedCategory, SeaBasedCategory } from "src/utils/decorators/global.enums.decorator";
import { CategoryMatchValidator } from "src/utils/helpers/custom-validator/category-match-validator.dto";

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
        example: EmployeeType.LAND_BASED,
        description: 'The deparment group of the employee'
    })
    department_group: EmployeeType;

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
        example: 'Rate from 1 to 5, 5 is highest 1 is lowest',
        description: 'Highest rate of this performance competency'
    })
    highest_score_limit?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(PerformanceRating, {
        message: 'Valid inputs are: unsatisfactory, needs_improvement, meets_expectations, exceed_expectations, exceptional'
        // message: 'If selected Land based group valid inputs are: rank_and_file and managerial_and_supervisory. If selected Sea based group valid inputs are: all_ranks, all_officers and top_2_master_chief_engineer.'
    })
    @Type(() => String)
    @ApiProperty({
        enum: PerformanceRating,
        example: PerformanceRating.exceptional,
        description: 'Highest rate of this performance competence'
    })
    performanceRating?: PerformanceRating;
}