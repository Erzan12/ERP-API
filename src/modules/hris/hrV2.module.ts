import { Module } from '@nestjs/common';
import { EmployeeControllerV2 } from './employee_masterlist/controllers/employeeV2.controller';
import { EmployeeService } from './employee_masterlist/employee.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardControllerV2 } from './dashboard/controllers/dashboardV2.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from '../administrator/administratorV2.module';
import { RoleManagementControllerV2 } from './role-management/controllers/role-managementV2.controller';
import { RoleManagementService } from './role-management/role-management.service';

@Module({
  imports: [AuthModule, AdministratorV2Module],
  providers: [EmployeeService, PrismaService, DashboardService, RoleManagementService],
  controllers: [EmployeeControllerV2, DashboardControllerV2, RoleManagementControllerV2],
  exports: [HrV2Module],
})
export class HrV2Module {}
