import { Module } from '@nestjs/common';
import { EmployeeController } from './employee_masterlist/employee.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService],
  controllers: [EmployeeController, DashboardController],
  exports: [HrModule],
})
export class HrModule {}
