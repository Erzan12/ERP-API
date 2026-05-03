import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { LeaveCategoryService } from './leave-category.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_READ, ACTION_UPDATE, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { CreateLeaveCategory, UpdateLeaveCategory } from './dto/leave-category.dto';

@ApiTags("Human Resources - Time and Attendance Cases (Leave Category)")
@Controller({path: 'hris', version: '2' })
export class LeaveCategoryController {
    constructor (
        private readonly leaveCategoryService: LeaveCategoryService
    ) {}

    @Get('time-and-attendance-cases/leave-category')
    @ApiOperation({ summary: 'List of all Leave Categories'})
    @ApiGetResponse('List of Leave Categories')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getLeaveCategories(
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCategoryService.getLeaveCategories(user)
    }

    @Get('time-and-attendance-cases/leave-category/:leaveCategoryId')
    @ApiOperation({ summary: 'Get a Leave Category' })
    @ApiGetResponse('Here is the Leave Category')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getLeaveCategory(
        @Param('leaveCategoryId', new ParseUUIDPipe()) leaveCategoryId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCategoryService.getLeaveCategory(leaveCategoryId, user)
    }

    @Post('time-and-attendance-cases/leave-category')
    @ApiBody({
        type: CreateLeaveCategory,
        description: 'Payload to create Leave Category'
    })
    @ApiOperation({ summary: 'Leave Category creation' })
    @ApiPostResponse('Leave Category successfully created')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    createLeaveCategory(
        @Body() dto: CreateLeaveCategory,
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCategoryService.createLeaveCategory(user, dto)
    }

    @Put('time-and-attendance-cases/leave-category/:leaveCategoryId')
    @ApiBody({
        type: UpdateLeaveCategory,
        description: 'Payload to update leave category'
    })
    @ApiOperation({ summary: 'Update a current leave category' })
    @ApiPatchResponse('Leave Category updated successfully')
    @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
    updateLeaveCategory(
        @Param('leaveCategoryId', new ParseUUIDPipe()) leaveCategoryId: string,
        @Body() dto: UpdateLeaveCategory,
        @SessionUser() user: RequestUser,
    ) {
        return this.leaveCategoryService.updateLeaveCategory(
            leaveCategoryId,
            user,
            dto)
    }
}
