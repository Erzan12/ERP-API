import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeService } from './employee/employee.service';
import { PersonController } from './person/person.controller';
import { PersonModule } from './person/person.module';
import { PrismaService } from 'prisma/prisma.service';
import { PersonService } from './person/person.service';

@Module({
  providers: [HrService, EmployeeService, PrismaService, PersonService],
  controllers: [EmployeeController, PersonController],
  imports: [PersonModule],
  exports: [HrModule]
})
export class HrModule {}
