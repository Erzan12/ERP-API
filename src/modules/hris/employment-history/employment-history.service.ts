import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmploymentHistory, EmploymentHistoryType } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Repository } from './type/employment-history.type';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEmploymentHistoryDto } from './dto/employment-history.dto';

@Injectable()
export class EmploymentHistoryService {
  constructor(private prisma: PrismaService) {}

  private get repositories(): Record<EmploymentHistoryType, Repository> {
    return {
      department: this.prisma.department,
      division: this.prisma.division,
      section: this.prisma.company,
      sub_section: this.prisma.company,
      company: this.prisma.company,
      position: this.prisma.position,
      salary_grade: this.prisma.salaryGrade,
      employment_status: this.prisma.employmentStatus,
      vessel: this.prisma.vessel,
      employee_location: this.prisma.userLocation,
      developmental_assignment: this.prisma.company,
    };
  }

  private async resolve(type: EmploymentHistoryType, id?: string | null) {
    if (!id) return null;

    switch (type) {
      case 'department':
        return this.prisma.department.findUnique({
          where: { id },
        });

      case 'division':
        return this.prisma.division.findUnique({
          where: { id },
        });

      case 'position':
        return this.prisma.position.findUnique({
          where: { id },
        });

      case 'salary_grade':
        return this.prisma.salaryGrade.findUnique({
          where: { id },
        });

      case 'employment_status':
        return this.prisma.employmentStatus.findUnique({
          where: { id },
        });

      case 'vessel':
        return this.prisma.vessel.findUnique({
          where: { id },
        });

      case 'employee_location':
        return this.prisma.userLocation.findUnique({
          where: { id },
        });

      default:
        return this.prisma.company.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
          }
        });
    }
  }

  async resolveEmploymentHistory(history: EmploymentHistory) {
    switch (history.type) {
      case EmploymentHistoryType.department:
        return {
          previous: history.previous_id
            ? await this.prisma.department.findUnique({
                where: { id: history.previous_id },
              })
            : null,

          current: history.current_id
            ? await this.prisma.department.findUnique({
                where: { id: history.current_id },
              })
            : null,
        };

      case EmploymentHistoryType.position:
        return {
          previous: history.previous_id
            ? await this.prisma.position.findUnique({
                where: { id: history.previous_id },
              })
            : null,

          current: history.current_id
            ? await this.prisma.position.findUnique({
                where: { id: history.current_id },
              })
            : null,
        };

      case EmploymentHistoryType.salary_grade:
        return {
          previous: history.previous_id
            ? await this.prisma.salaryGrade.findUnique({
                where: { id: history.previous_id },
              })
            : null,

          current: history.current_id
            ? await this.prisma.salaryGrade.findUnique({
                where: { id: history.current_id },
              })
            : null,
        };
    }
  }

  async getEmploymentHistories(user: RequestUser, employeeId: string) {
    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            person: true,
            position: true,
          },
        },
        user_roles: true,
      },
    });

    if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
      throw new BadRequestException(`User does not exist.`);
    }

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Recruiter',
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const employmentHistories = await this.prisma.employmentHistory.findMany({
      where: {
        employee_id: employeeId,
      },
      orderBy: {
        effectivity_date: 'desc',
      },
    });

    if (employmentHistories.length === 0) {
      throw new NotFoundException('No employment history found.');
    }

    const resolvedHistories = await Promise.all(
      employmentHistories.map(async (history) => ({
        ...history,

        previous: await this.resolve(history.type, history.previous_id),

        current: await this.resolve(history.type, history.current_id),
      })),
    );

    return {
      status: 'success',
      message: 'Here is the Employee employment history',
      employmentHistories: resolvedHistories,
    };
  }

  async createEmploymentHistory(
    user: RequestUser,
    employeeId: string,
    dto: CreateEmploymentHistoryDto,
  ) {
    // Get the latest history of this type for this employee
    const latestHistory = await this.prisma.employmentHistory.findFirst({
      where: {
        employee_id: employeeId,
        type: dto.type,
      },
      orderBy: {
        effectivity_date: 'desc',
      },
    });

    const previousId = latestHistory?.current_id ?? null;

    // Make sure the new current_id exists
    const current = await this.resolve(dto.type, dto.current_id);

    if (!current) {
      throw new BadRequestException('Invalid current record.');
    }

    const employmentHistory = await this.prisma.employmentHistory.create({
      data: {
        employee_id: employeeId,
        type: dto.type,
        previous_id: previousId,
        current_id: dto.current_id,
        effectivity_date: new Date(dto.effectivity_date),
        remarks: dto.remarks,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message: 'Employment history successfully created',
      employmentHistory,
    };
  }
}
