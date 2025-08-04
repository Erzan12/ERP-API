import { Injectable, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/Mail/mail.service';
import { CreatePermissionTemplateDto } from 'src/Administrator/role/dto/create-permission-template.dto';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';
import { DeactivateUserAccountDto, ReactivateUserAccountDto } from './dto/user-account-status.dto';
import { RequestUser } from '../Components/types/request-user.interface';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService, private readonly mailService: MailService, ) {}
    
    async viewUserAccount(user: RequestUser) {
        const canViewAllUsers = user.roles.some(role => role.name === 'Administrator', 'Manager');

        const users = await this.prisma.user.findMany({
            where: canViewAllUsers ? {} : { id: user.id },
            select: {
                id: true,
                username: true,
                roles: {
                    select: {
                        name: true,
                    },
                },
                stat: true
            },
        });
        return {
            status: 'success',
            message: canViewAllUsers ? 'All User Accounts' : 'User Account',
            data: {
                user_accounts: users
            },
        };
    }

    //refactored version no more role_ids and module_ids in user account creation will be basing on the permission_tempalte model
    async createUserAccount(createUserWithTemplateDto: CreateUserWithTemplateDto, user) {
    return this.prisma.$transaction(async (tx) => {
        const plainPassword = createUserWithTemplateDto.user_details.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: createUserWithTemplateDto.user_details.username },
                    { email: createUserWithTemplateDto.user_details.email },
                ],
            },
        });

        if (existingUser) {
            throw new BadRequestException('Username or email address already exist!');
        }

        const createUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    },
                },
            },
        });

        if (!createUser || !createUser.employee || !createUser.employee.person) {
            throw new BadRequestException(`Creator (manager) information not found.`);
        }

        const admin = `${createUser.employee.person.first_name} ${createUser.employee.person.last_name}`;
        const adminPos = createUser.employee.position.name;

        const employee = await this.prisma.employee.findUnique({
            where: { employee_id: createUserWithTemplateDto.user_details.employee_id },
            include: { person: true },
        });

        if (!employee) {
            throw new BadRequestException('Employee not found');
        }

        const userExist = await this.prisma.user.findUnique({
            where: { employee_id: employee.id },
        });

        if (userExist) {
            throw new BadRequestException('User already exist');
        }

        const userCreate = await tx.user.create({
            data: {
                employee_id: employee.id,
                person_id: employee.person.id,
                username: createUserWithTemplateDto.user_details.username,
                email: createUserWithTemplateDto.user_details.email,
                password: hashedPassword,
                stat: 1,
                require_reset: 1,
                created_by: createUser.id,
                created_at: new Date(),
            },
            include: { employee: true },
        });

        const empDept = await this.prisma.employee.findUnique({
            where: { id: employee.id },
            include: { department: true },
        });

        if (!empDept) {
            throw new BadRequestException('Employee Department does not exist');
        }

        const permissionTemplateIds = createUserWithTemplateDto.user_permission_template_ids;

        if (!Array.isArray(permissionTemplateIds) || permissionTemplateIds.length === 0) {
            throw new BadRequestException('Permission template IDs must be a non-empty array.');
        }

        // Fetch existing template IDs from DB
        const existingTemplates = await this.prisma.permissionTemplate.findMany({
            where: { id: { in: permissionTemplateIds } },
            select: { id: true },
        });

        const existingTemplateIds = existingTemplates.map(t => t.id);

        // Find invalid or non-existing IDs
        const invalidIds = permissionTemplateIds.filter(id => !existingTemplateIds.includes(id));

        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `The following permission template IDs do not exist: [${invalidIds.join(', ')}]`
            );
        }

        // Fetch all permissionTemplateRolePermission entries with related role_permission
        const templateLinks = await this.prisma.permissionTemplateRolePermission.findMany({
            where: { permission_template_id: { in: permissionTemplateIds } },
            include: { role_permission: true }
        });

        // Group permissions by template ID
        const groupedByTemplate = new Map<number, typeof templateLinks>();

        for (const id of permissionTemplateIds) {
            const perms = templateLinks.filter(link => link.permission_template_id === id);
            if (perms.length > 0) {
                groupedByTemplate.set(id, perms);
            }
        }

        const createdUserRoles = new Map<string, any>();

        for (const [templateId, permissions] of groupedByTemplate.entries()) {
            const { role_id, module_id } = permissions[0].role_permission;
            const key = `${role_id}-${module_id}`;
            const permTemp = await this.prisma.permissionTemplate.findUnique({
                where: { id: templateId },
                include: { departments: true },
            });

            if (!permTemp || permTemp.departments.length === 0) {
            throw new BadRequestException('Permission template has no associated department');
            }

            const departmentId = permTemp.departments[0].department_id;

            let userRole = createdUserRoles.get(key);
            if (!userRole) {
            userRole = await tx.userRole.create({
                data: {
                user_id: userCreate.id,
                role_id,
                module_id,
                department_id: departmentId,
                created_at: new Date(),
                },
            });
            createdUserRoles.set(key, userRole);
            }

            const userPermissionsData = permissions.map(tp => ({
                user_id: userCreate.id,
                user_role_id: userRole.id,
                user_role_permission: tp.role_permission.action,
                role_permission_id: tp.role_permission_id,
            }));

            if (userPermissionsData.length > 0) {
                await tx.userPermission.createMany({ data: userPermissionsData });
            }

            // Connect user to the permission templates
            await tx.user.update({
                where: { id: userCreate.id },
                data: {
                    permission_templates: {
                        connect: permissionTemplateIds.map(id => ({ id })),
                    },
                },
            });

            // Optional: link template to role
            await tx.role.update({
                where: { id: role_id },
                data: {
                    users: { connect: [{ id: userCreate.id }] },
                    permission_template: {
                        connect: [{ id: templateId }],
                    },
                },
            });
        }

        // connect selected permission templates to corresponding modules & user
        const templates = await tx.permissionTemplate.findMany({
            where: { id: { in: permissionTemplateIds } },
            select: { id: true, name: true,  module_id: true },
        });

        const moduleTemplateMap = new Map<number, number[]>();
        for (const template of templates) {
            if (!moduleTemplateMap.has(template.module_id)) {
                moduleTemplateMap.set(template.module_id, []);
            }
            moduleTemplateMap.get(template.module_id)!.push(template.id);
        }

        for (const [moduleId, templateIds] of moduleTemplateMap.entries()) {
            await tx.module.update({
                where: { id: moduleId },
                data: {
                    users: { connect: { id: userCreate.id } },
                    permission_templates: {
                        connect: templateIds.map(id => ({ id })),
                    },
                },
            });
        }

        // Create password reset token
        const tokenKey = crypto.randomBytes(64).toString('hex');
        const createdToken = await tx.passwordResetToken.create({
            data: {
                user_id: userCreate.id,
                password_token: tokenKey,
                expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000),
            },
        });

        // Generate user session token
        const userToken = crypto.randomBytes(64).toString('hex');
        await tx.userToken.create({
            data: {
                user_id: userCreate.id,
                user_token: userToken,
            },
        });

        // Send welcome email
        await this.mailService.sendWelcomeMail(
            user.email,
            user.username,
            plainPassword,
            tokenKey,
        );

        return {
            status: 'success',
            message: `User ${userCreate.username} with Employee ID ${userCreate.employee.employee_id} created with temporary password.`,
            created_by: {
                id: createUser.id,
                name: admin,
                position: adminPos,
            },
            user_id: userCreate.id,
            username: userCreate.username,
            password: plainPassword,
            reset_token: createdToken.password_token,
            user_permission_template: templates
        };
    });
    }


    async userNewResetToken(userEmailResetTokenDto: UserEmailResetTokenDto, user: RequestUser) {

        const requestUser = await this.prisma.user.findUnique({
            where: { email: userEmailResetTokenDto.email },
        });

        if(!requestUser) {
            throw new BadRequestException('User with this email not found')
        }
        
        //optionally deletes the expired token in db
        await this.prisma.passwordResetToken.deleteMany({
            where: { id: requestUser.id }
        })

        //generate new token
        const tokenKey = crypto.randomBytes(64).toString('hex');

        const createdToken = await this.prisma.passwordResetToken.create({
            data: {
                user: {
                    connect: { id: requestUser.id }
                },
                password_token: tokenKey,
                // ⛔ TEMP: For testing - token expires in 3 days
                expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), //3days
                is_used: false
            }
        });

        //send new reset email
        await this.mailService.sendResetTokenEmail(
            requestUser.email,
            requestUser.username,
            tokenKey,
        );

        return ({
            status: 'success',
            message: `Reset token created and sent to ${requestUser.email}`,
            user_id: requestUser.id,
            reset_token: createdToken.password_token,
        });
    }

    async deactivateUserAccount(deactivateUserAccountDto: DeactivateUserAccountDto, user) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: deactivateUserAccountDto.user_id }
        });

        if(!existingUser){
            throw new BadRequestException('User not found');
        }

        if(existingUser.stat === 0) {
            throw new ForbiddenException('User account is already deactivated')
        }

        // deactivation method
        await this.prisma.user.update({
            where: { id: deactivateUserAccountDto.user_id },
            data: {
                stat: 0,
                is_active: false,
            },
        });

        return {
            status: 'success',
            message: `User ID ${deactivateUserAccountDto.user_id} has been deactivated`,
            deactivated_by: `User Role ID No. ${user.id}`
        }
    }

    async reactivateUserAccount(reactivateUserAccountDto: ReactivateUserAccountDto, user) {
        
        const existingDeactivatedUser = await this.prisma.user.findUnique({
            where: { id: reactivateUserAccountDto.user_id },
        }); 

        if(!existingDeactivatedUser) {
            throw new BadRequestException('Deactivated User not found');
        }

        if(existingDeactivatedUser.stat === 1) {
            throw new ConflictException('User Account is still active');
        }
        
        await this.prisma.user.update({
            where: { id: reactivateUserAccountDto.user_id },
            data: {
                stat: 1,
                is_active: true,
            },
        });

        return {
            status: 'success',
            message: `User ID ${reactivateUserAccountDto.user_id} has been reactivated!`,
            reactivated_by: `User Role ID No. ${user.id}`
        }
    }

    async viewNewEmployeeWithoutUserAccount(user: RequestUser) {
        
        const isAdmin = user.roles.some((role) => role.name === 'Administrator');
        const isManager = user.roles.some((role) => role.name === 'Manager');

        const findUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: true
            }
        })

        if(!findUser){
            throw new BadRequestException('User does not exist')
        };

        // Find the manager's department (if not admin)
        let departmentFilter = {};
        if (!isAdmin) {
            const currentEmployee = await this.prisma.employee.findUnique({
                where: { id: findUser.employee.id },
                select: { department_id: true },
            });

            if (!currentEmployee) {
                throw new ForbiddenException('User is not linked to an employee profile.');
            }

            // Only allow managers to view their own department
            if (isManager) {
                departmentFilter = { department_id: currentEmployee.department_id };
            } else {
                throw new ForbiddenException('Only administrators or department managers can view new employees.');
            }
        }

        // Fetch employees with no user account in allowed department
        const newEmployees = await this.prisma.employee.findMany({
            where: {
                user: null,
                ...departmentFilter,
            },
            select: {
                id: true,
                employee_id: true,
                person: true,
                department: {
                    select: { id: true, name: true },
                },
                user: true,
            },
        });

        if (newEmployees.length === 0) {
            throw new ForbiddenException('No new employees without user accounts found.');
        }

        return {
            status: 'success',
            message: findUser
                ? 'All new employees without user accounts'
                : 'New employees in your department without user accounts',
            data: {
                employees: newEmployees,
            },
        };
    }
    
    async getUsersWithRolesAndPermissions() {
        const users = await this.prisma.user.findMany({
            include: {
            user_roles: {
                include: {
                role: true,
                module: true,
                user_permissions: {
                    include: {
                    role_permission: {
                        include: {
                        permission: true,
                        },
                    },
                    },
                },
                },
            },
            },
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.user_roles.map(userRole => ({
            roleId: userRole.role.id,
            roleName: userRole.role.name,
            module: {
                id: userRole.module.id,
                name: userRole.module.name,
            },
            permissions: userRole.user_permissions.map(up => ({
                action: up.user_role_permission,
                permissionName: up.role_permission?.permission.name,
                status: up.role_permission?.status,
            })),
            })),
        }));

        return formattedUsers;
    }
}
