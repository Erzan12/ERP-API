import { 
    ACTION_CREATE,
    MODULE_MNGR,  
 } from '../Components/decorators/ability';
import { Can } from '../Components/decorators/can.decorator';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestUser } from '../Components/types/request-user.interface';
import { UserService } from 'src/User/user.service';
import { CreateUserWithTemplateDto } from '../User/dto/create-user-with-template.dto';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { SM_MANAGER } from '../Components/constants/core-constants';

@Controller('manager')
export class ManagerController {
    constructor( private userService: UserService) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 


}