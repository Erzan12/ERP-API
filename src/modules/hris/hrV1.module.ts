import { Module } from '@nestjs/common';
import { EmployeeControllerV1 } from './employee_masterlist/controllers/employeeV1.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV1 } from './dashboard/controllers/dashboardV1.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoleManagementControllerV2 } from './role-management/controllers/role-managementV2.controller';
import { RoleManagementService } from './role-management/role-management.service';

@Module({
  imports: [AuthModule],
  providers: [EmployeeService, PrismaService, DashboardService, RoleManagementService],
  controllers: [EmployeeControllerV1, DashboardControllerV1, RoleManagementControllerV2],
  exports: [HrV1Module],
})
export class HrV1Module {}
