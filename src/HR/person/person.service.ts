import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeletePersonDto } from './dto/delete-person.dto';

@Injectable()
export class PersonService {
    constructor (private prisma: PrismaService) {}

    private async deleteUserDependencies(tx, user_id: number) {
        await tx.passwordResetToken.deleteMany({ where: { user_id } });
        await tx.userToken.deleteMany({ where: { user_id } });
        await tx.userPermissionCompany.deleteMany({ where: { user_id } });
        await tx.userPermission.deleteMany({ where: { user_id } });
        await tx.user.delete({ where: { id: user_id } });
    }
    
    //delete a person from db safely via transaction so that everything will rollback if during the process encounters an error
    async deletePersonWithRelations(person_id: number): Promise<void> {
    const existingPerson = await this.prisma.person.findUnique({
        where: { id: person_id },
        include: {
        employee: {
            include: { user: true }
        },
        },
    });

    if (!existingPerson) {
        throw new NotFoundException(`Person with ID ${person_id} not found.`);
    }

    const employee_id = existingPerson.employee?.id;
    const user_id = existingPerson.employee?.user?.id;

    try {
            await this.prisma.$transaction(async (tx) => {
            await tx.emailAddress.deleteMany({ where: { person_id } });

            if (!user_id) throw new Error('User ID is missing!');

            if (user_id) {
                await tx.passwordResetToken.deleteMany({ where: { user_id } });
                await tx.userToken.deleteMany({ where: { user_id } });
                await tx.userPermission.deleteMany({ where: { user_id } });
                await tx.userRole.deleteMany({ where: { user_id } });
                await tx.user.delete({ where: { id: user_id } });
            }

            if (!employee_id) throw new Error('Employee ID is missing!');

            if (employee_id) {
                await tx.employee.delete({ where: { id: employee_id } });
            }
                await tx.person.delete({ where: { id: person_id } });

                return { message: `Person with ID ${person_id} deleted successfully.` };
            });
            
        } catch (err) {
            console.error('Transaction failed:', err);
                throw err;
        }
    }
}
