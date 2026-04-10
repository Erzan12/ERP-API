import { Controller, Get, Session } from '@nestjs/common';
import { RegularizationReviewsService } from './regularization_reviews.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Performance Management (Regularization Reviews)')
@Controller({path:'regularization-reviews', version: '2'})
export class RegularizationReviewsController {
    constructor(private readonly regularizationService: RegularizationReviewsService) {}

    @Get()
    @ApiOperation({ summary: 'List of all employees for regularization' })
    @ApiGetResponse('List of for regularization employees')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getForRegularizaiton(
        @SessionUser() user: RequestUser,
    ) {
        return this.regularizationService.getForRegularization(user);
    }
}
