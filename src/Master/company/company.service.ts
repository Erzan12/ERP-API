import { BadRequestException, NotFoundException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async getCompanies(user: RequestUser) {
        const company = await this.prisma.company.findMany()

        if(!company) {
            throw new BadRequestException('No available companies found');
        }

        return {
            status: 'success',
            message: 'Here are the list of Companies',
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

    async updateCompany(updateCompanyDto: UpdateCompanyDto, user: RequestUser) {
        const existingCompany = await this.prisma.company.findUnique({
            where: { id: updateCompanyDto.company_id },
            select: {
                name: true,
                stat: true,
            }
        });

        if(!existingCompany || existingCompany.stat === 0){
            throw new NotFoundException('Company does not exist or inactive!');
        }

        const updateCompany = await this.prisma.company.update({
            where: { id: updateCompanyDto.company_id },
            data: {
                name: updateCompanyDto.name,
                address: updateCompanyDto.address,
                telephone_no: updateCompanyDto.telephone_no,
                fax_no: updateCompanyDto.fax_no,
                company_tin: updateCompanyDto.company_tin,
                is_top_20000: updateCompanyDto.is_top_20000,
                abbreviation: updateCompanyDto.abbreviation,
                stat: updateCompanyDto.stat,
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
