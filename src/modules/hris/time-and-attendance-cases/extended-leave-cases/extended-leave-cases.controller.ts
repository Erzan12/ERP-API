import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtendedLeaveCasesService } from './extended-leave-cases.service';

@ApiTags('Human Resources - Time and Attendance Cases (Extended Leave Cases)')
@Controller({path:'extended-leave-cases', version: '2'})
export class ExtendedLeaveCasesController {
    constructor (private readonly extendedLeaveCasesService: ExtendedLeaveCasesService) {}
    
}
