import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class SecurityClearanceService {
  constructor(private prisma: PrismaService) {}

  async updateUserClearance(
    adminId: string,
    targetUserId: string,
    newClearanceLevel: number,
    adminClearanceLevel: number,
  ) {
    // validate admin authority
    if (adminClearanceLevel < 9) {
      throw new ForbiddenException(
        'Only administrators with security clearance level 9 can modify clearance levels.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('Target user not found');
    }

    if (user.id === adminId) {
      throw new ForbiddenException(
        'You cannot change your own clearance level.',
      );
    }

    if (user.security_clearance_level === newClearanceLevel) {
      throw new BadRequestException(
        `User already has security clearance level ${newClearanceLevel}.`,
      );
    }

    // apply the update
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        security_clearance_level: newClearanceLevel,
      },
      include: {
        person: true,
      },
    });

    return {
      status: 'success',
      message: `Security clearance updated to level ${newClearanceLevel}, for user ${updated.person.first_name} ${updated.person.last_name}`,
      user: {
        id: updated.id,
        email: updated.email,
        security_clearance_level: updated.security_clearance_level,
      },
    };
  }
}
