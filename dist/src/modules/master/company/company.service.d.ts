import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    getCompany(companyId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        company: {
            createdBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
        } & {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            address: string | null;
            telephone_no: string | null;
            fax_no: string | null;
            company_tin: string | null;
            abbreviation: string;
            is_top_20000: number;
        };
    }>;
    getCompanies(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        companies: ({
            createdBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
        } & {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            address: string | null;
            telephone_no: string | null;
            fax_no: string | null;
            company_tin: string | null;
            abbreviation: string;
            is_top_20000: number;
        })[];
    }>;
    createCompany(createCompanyDto: CreateCompanyDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        company: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            address: string | null;
            telephone_no: string | null;
            fax_no: string | null;
            company_tin: string | null;
            abbreviation: string;
            is_top_20000: number;
        };
        created_by_user: string;
    }>;
    updateCompany(companyId: string, updateCompanyDto: UpdateCompanyDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updatedCompany: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            address: string | null;
            telephone_no: string | null;
            fax_no: string | null;
            company_tin: string | null;
            abbreviation: string;
            is_top_20000: number;
        };
        updated_by_user: string;
    }>;
}
