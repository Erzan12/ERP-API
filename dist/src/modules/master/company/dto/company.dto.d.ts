export declare class CreateCompanyDto {
    name: string;
    address: string;
    telephone_no?: string;
    fax_no?: string;
    company_tin?: string;
    is_top_20000?: number;
    abbreviation: string;
}
export declare class UpdateCompanyDto {
    name?: string;
    address?: string;
    telephone_no?: string;
    fax_no?: string;
    company_tin?: string;
    is_top_20000?: number;
    abbreviation?: string;
    is_active?: boolean;
}
