import { Injectable, Logger } from '@nestjs/common';
import { AuditLogData } from './types/audit-log-data.interface';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Request } from 'express';
import { NewUserData } from 'src/utils/types/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  //create an audit log entry
  async log(data: AuditLogData): Promise<void> {
    try {
      //auto detect changed fields if old and new values provided
      const changedFields =
        data.changed_fields ||
        this.detectChangedFields(data.old_values, data.new_values);

      //auto detect severity
      const severity = data.severity || this.determineSeverity(data);

      const complianceFlag =
        data.compliance_flag ?? this.isComplianceCritical(data);

      await this.prisma.auditTrail.create({
        data: {
          user_id: data.user?.id,
          user_email: data.user?.email,
          employee_id: await this.getEmployeeId(data.user?.id),
          action: data.action,
          resource: data.resource,
          resource_id: data.resource_id,
          old_values: data.old_values
            ? (JSON.parse(
                JSON.stringify(data.old_values),
              ) as Prisma.InputJsonValue)
            : Prisma.JsonNull, // use Prisma.JsonNull instead of null
          new_values: data.new_values
            ? (JSON.parse(
                JSON.stringify(data.new_values),
              ) as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          change_fields: changedFields,
          ip_address: data.ip_address,
          user_agent: data.user_agent,
          endpoint: data.endpoint,
          http_method: data.http_method,
          status_code: data.status_code,
          success: data.success ?? true,
          error_message: data.error_message,
          department_id: data.department_id,
          session_id: data.session_id,
          request_id: data.request_id,
          severity,
          compliance_flag: complianceFlag,
        },
      });

      //log critical events
      if (severity === 'CRITICAL' || complianceFlag) {
        this.logger.warn(
          `CRITICAL AUDIT: ${data.action} on ${data.resource} by user ${data.user?.email}`,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create audit log:', error.message);
      } else {
        this.logger.error('Failed to create audit log:', error);
      }
    }
  }

  //get employee_id from user_id
  private async getEmployeeId(userId?: string): Promise<string | null> {
    if (!userId) return null;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { employee_id: true },
      });
      return user?.employee_id || null;
    } catch (error: unknown) {
      this.logger.error(
        'Failed to fetch employee ID:',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  //detect which fields chage between old and new values
  private detectChangedFields<T extends object>(
    oldValues?: T,
    newValues?: T,
  ): string[] {
    if (!oldValues || !newValues) return [];

    const changed: string[] = [];
    const allKeys = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);

    for (const key of allKeys) {
      if (
        JSON.stringify(oldValues[key as keyof T]) !==
        JSON.stringify(newValues[key as keyof T])
      ) {
        changed.push(key);
      }
    }

    return changed;
  }

  //determine severity based on action and resource
  private determineSeverity(
    data: AuditLogData,
  ): 'INFO' | 'WARNING' | 'CRITICAL' {
    //CRITICAL:failed auth, permission denials, deletions, clearance changes
    if (
      !data.success ||
      data.action === 'PERMISSION_DENIED' ||
      data.action === 'LOGIN_FAILED' ||
      data.action === 'DELETE' ||
      data.changed_fields?.includes('security_clearance_level') ||
      data.changed_fields?.includes('password')
    ) {
      return 'CRITICAL';
    }

    //warning: updates to sensitive resources
    if (
      data.action === 'UPDATE' &&
      ['user_account', 'role_permission', 'salary', 'employee'].includes(
        data.resource,
      )
    ) {
      return 'WARNING';
    }

    return 'INFO';
  }

  //check if operation is compliance-critical
  private isComplianceCritical(data: AuditLogData): boolean {
    const criticalResources = [
      'salary',
      'employee',
      'role_permission',
      'user_account',
      'security_clearance',
    ];

    const criticalFields = [
      'salary',
      'password',
      'security_clearance_level',
      'employment_status_id',
    ];

    const criticalActions = ['DELETE', 'PERMISSION_DENIED'];

    return (
      criticalResources.includes(data.resource) ||
      criticalActions.includes(data.action) ||
      data.changed_fields?.some((field) => criticalFields.includes(field)) ||
      false
    );
  }

  // log authentication events
  async logAuth(
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'TOKEN_REFRESH',
    user: RequestUser | undefined,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true,
    errorMessage?: string,
  ): Promise<void> {
    await this.log({
      user,
      action,
      resource: 'authentication',
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      error_message: errorMessage,
      severity: success ? 'INFO' : 'CRITICAL',
    });
  }

  //log user account creation
  // async logUserCreation({
  //   actorUserId, //the user performing the action
  //   actorEmail, //email of the actor
  //   newUser, // the create user object
  //   req, //express request to get ip, user-agent
  // }: {
  //   actorUserId?: string;
  //   actorEmail?: string;
  //   newUser: {
  //     id: string;
  //     employee_id?: string | null;
  //     [key: string]: any;
  //   }; //user entity
  //   req: Request;
  // }) {
  //   try {
  //     return await this.prisma.auditTrail.create({
  //       data: {
  //         user_id: actorUserId ?? null,
  //         user_email: actorEmail ?? null,
  //         employee_id: newUser.employee_id ?? null,
  //         action: 'CREATE',
  //         resource: 'user_account',
  //         resource_id: newUser.id,
  //         old_values: undefined,
  //         new_values: newUser,
  //         change_fields: Object.keys(newUser),
  //         ip_address: req.ip ?? undefined,
  //         user_agent: req?.headers['user-agent'] ?? null,
  //         endpoint: req ? `${req.method} ${req.originalUrl}` : null,
  //         http_method: req?.method ?? null,
  //         status_code: 201,
  //         success: true,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Failed to log audit trail:', error);
  //   }
  // }

  async logUserCreation({
    actorUserId,
    actorEmail,
    newUser,
    req,
  }: {
    actorUserId?: string;
    actorEmail?: string;
    newUser: NewUserData;
    req: Request;
  }) {
    try {
      return await this.prisma.auditTrail.create({
        data: {
          user_id: actorUserId ?? null,
          user_email: actorEmail ?? null,
          employee_id: newUser.employee_id ?? null,
          action: 'CREATE',
          resource: 'user_account',
          resource_id: newUser.id,
          old_values: undefined,
          new_values: JSON.parse(
            JSON.stringify(newUser),
          ) as Prisma.InputJsonValue, // ensures type safety
          change_fields: Object.keys(newUser),
          ip_address: req.ip ?? undefined,
          user_agent: req.headers['user-agent'] ?? null,
          endpoint: `${req.method} ${req.originalUrl}`,
          http_method: req.method,
          status_code: 201,
          success: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create audit log:', error.message);
      } else {
        this.logger.error('Failed to create audit log:', error);
      }
    }
  }

  // log permission denials
  async logPermissionDenied(
    user: RequestUser,
    action: string,
    resource: string,
    ipAddress?: string,
    endpoint?: string,
  ): Promise<void> {
    await this.log({
      user,
      action: 'PERMISSION_DENIED',
      resource,
      ip_address: ipAddress,
      endpoint,
      success: false,
      error_message: `User attemped to ${action} ${resource} without permission`,
      severity: 'CRITICAL',
    });
  }

  // query audit logs with filters
  async findLogs(filters: {
    user_id?: string;
    employee_id?: string;
    department_id?: string;
    resource?: string;
    action?: string;
    start_date?: Date;
    end_date?: Date;
    success?: boolean;
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
    compliance_flag?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const {
      user_id,
      employee_id,
      department_id,
      resource,
      action,
      start_date,
      end_date,
      success,
      severity,
      compliance_flag,
      limit = 100,
      offset = 0,
    } = filters;

    return this.prisma.auditTrail.findMany({
      where: {
        user_id,
        employee_id,
        department_id,
        resource,
        action,
        success,
        severity,
        compliance_flag,
        created_at: {
          gte: start_date,
          lte: end_date,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employee_id: true,
          },
        },
      },
    });
  }

  // get audit trail for ta specific resource
  async getResourceHistory(resource: string, resource_id: string) {
    return this.prisma.auditTrail.findMany({
      where: {
        resource,
        resource_id,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  // get user activity report
  async getUserActivity(user_id: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.auditTrail.findMany({
      where: {
        user_id,
        created_at: {
          gte: startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // get department activity report
  async getDepartmentActivity(department_id: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.auditTrail.findMany({
      where: {
        department_id,
        created_at: {
          gte: startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  // get compliance-critical audit logs
  async getComplianceLogs(days: number = 90) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.auditTrail.findMany({
      where: {
        compliance_flag: true,
        created_at: {
          gte: startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  // get security incidents (fialed operations, permission denials)
  async getSecurityIncidents(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.auditTrail.findMany({
      where: {
        OR: [
          { severity: 'CRITICAL' },
          { success: false },
          { action: 'PERMISSION_DENIED' },
        ],
        created_at: {
          gte: startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }
}
