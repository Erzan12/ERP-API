import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { EmployeeController } from './employee_masterlist/employee.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
// import { PersonController } from './person/person.controller';
// import { PersonModule } from './person/person.module';
import { PrismaService } from 'prisma/prisma.service';
// import { PersonService } from './person/person.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  providers: [HrService, EmployeeService, PrismaService, DashboardService],
  controllers: [EmployeeController, DashboardController],
  exports: [HrModule]
})
export class HrModule {}
