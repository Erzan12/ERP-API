import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateSecurityClearanceDto } from './dto/update-security-clearance.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class SecurityClearanceService {
  constructor(private prisma: PrismaService) {}

  async updateUserClearance(
    userId: string,
    user: RequestUser,
    dto: UpdateSecurityClearanceDto,
  ) {
    // validate admin authority
    if (user.security_clearance_level < 7) {
      throw new ForbiddenException(
        'Only administrators with security clearance level 9 can modify clearance levels.',
      );
    }

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

    // const user = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // if (!user) {
    //   throw new NotFoundException('Target user not found');
    // }

    // Temp comment down this section for development purposes in staging
    // if (user.id === userId) {
    //   throw new ForbiddenException(
    //     'You cannot change your own clearance level.',
    //   );
    // }

    if (user.security_clearance_level === dto.new_level) {
      throw new BadRequestException(
        `User already has security clearance level ${dto.new_level}.`,
      );
    }

    // apply the update
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        security_clearance_level: dto.new_level,
      },
      include: {
        person: true,
      },
    });

    return {
      status: 'success',
      message: `Security clearance updated to level ${dto.new_level}, for user ${updated.person.first_name} ${updated.person.last_name}`,
      user: {
        id: updated.id,
        email: updated.email,
        security_clearance_level: updated.security_clearance_level,
      },
    };
  }
}
