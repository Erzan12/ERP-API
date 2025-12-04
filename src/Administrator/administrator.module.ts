import { Module } from '@nestjs/common';
import { AuthModule } from 'src/Auth/auth.module';
import { AdministratorController } from 'src/Administrator/administrator.controller';
import { AdministratorService } from 'src/Administrator/administrator.service';
import { JwtStrategy } from '../Components/middleware/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/Mail/mail.service';
import { SubModuleService } from './sub_module/sub_module.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { ModuleController } from './module/module.controller';
import { SubModuleController } from './sub_module/sub_module.controller';
import { EmploymentStatusController } from '../Master/employment_status/employment_status.controller';
import { EmploymentStatusService } from '../Master/employment_status/employment_status.service';
import { SecurityClearanceService } from './security_clearance/security-clearance.service';
import { SecurityClearanceController } from './security_clearance/security-clearance.controller';
import { UserService } from 'src/Manager/user/user.service';

@Module({
    imports:[AuthModule],
    controllers: [AdministratorController, SubModuleController, ModuleController, RoleController, EmploymentStatusController, EmploymentStatusController, SecurityClearanceController],
    providers: [AdministratorService, JwtStrategy, JwtService, PrismaService, UserService, MailService, SubModuleService, ModuleService, RoleService, EmploymentStatusService, SecurityClearanceService],
    exports: [AdministratorModule]

})
export class AdministratorModule {}
