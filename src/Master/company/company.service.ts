import { BadRequestException, NotFoundException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    //query single company
    async getCompany(companyId: number, user: RequestUser) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId }
        })

        if (!company) {
            throw new BadRequestException('Company not found.');
        }

        return {
            status: 'success',
            message: 'Here is the Company.',
            data: {
                company,
            }
        }
    }

    //query all company available
    async getAllCompany(user: RequestUser) {
        const company = await this.prisma.company.findMany()

        if(!company) {
            throw new BadRequestException('No available companies found.');
        }

        return {
            status: 'success',
            message: 'Here are the list of Companies.',
            data: {
                company,
            }
        }
    }

    async createCompany(createCompanyDto: CreateCompanyDto, user: RequestUser) {
        const { name, address, telephone_no, fax_no, company_tin, is_top_20000, abbreviation, stat } = createCompanyDto;

        const createCompany = await this.prisma.company.create({
            data: {
                name,
                address,
                telephone_no,
                fax_no,
                company_tin,
                abbreviation,
                is_top_20000,
                stat
            }
        });

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                }
            }
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos  = requestUser.employee.position.name

        return {
            status: 'success',
            message: `${createCompany.name} Company has been createad successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            company_id: createCompany.id,
            company_name: createCompany.name,
        }
    }

    async updateCompany(companyId: number, updateCompanyDto: UpdateCompanyDto, user: RequestUser) {
        const { name, address, telephone_no, fax_no, company_tin, is_top_20000, abbreviation, stat } = updateCompanyDto

        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: {
                name: true,
                stat: true,
            }
        });

        if(!company || company.stat === 0){
            throw new NotFoundException('Company does not exist or inactive!');
        }

        const updateCompany = await this.prisma.company.update({
            where: { id: companyId },
            data: {
                name,
                address,
                telephone_no,
                fax_no,
                company_tin,
                is_top_20000,
                abbreviation,
                stat,
            }
        });

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                }
            }
        });

        if(!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${updateCompany.name} Company has been updated successfully!`,
            updated_by: {
                id: requestUser.id,
                name:userName,
                position: userPos
            },
            data: {
                company_id: updateCompany.id,
                company_name: updateCompany.name
            },
        };
    }
}
