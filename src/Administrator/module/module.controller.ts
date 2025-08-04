import { Controller,Post, Body, Put, Delete } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Can } from '../../Components/decorators/can.decorator';
import { ACTION_CREATE, MODULE_ADMIN } from '../../Components/decorators/ability';
import { SM_ADMIN } from '../../Components/constants/core-constants';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('administrator')
export class ModuleController {
    constructor(private moduleService: ModuleService) {}

    @Post('module')                                                                       
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN],
    })
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @SessionUser() user: RequestUser                                                            // to make enum decorator
        ) {
        return this.moduleService.createModule(createModuleDto, user)
    }

    // @Put()
    // async updateModule({

    // })

    // @Delete()
    // async deleteModule({

    // })
}
