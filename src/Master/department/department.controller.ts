import { Body, Controller, Post, Patch, Get } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { Can } from 'src/Components/decorators/can.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('department')
export class DepartmentController {}
