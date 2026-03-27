import { ApplicationSource, ApplicationStatus } from 'src/utils/decorators/global.enums.decorator';
import { ApplicantDocumentDto } from './applicant-document.dto';
export declare class CreateApplicantDto {
    career_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    mobile_number: string;
    application_source: ApplicationSource;
    application_status: ApplicationStatus;
    date_applied: string;
    documents: ApplicantDocumentDto[];
}
export declare class UpdateApplicantDto {
    career_id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    mobile_number?: string;
    application_source?: ApplicationSource;
    application_status?: ApplicationStatus;
    date_applied?: string;
    isActive?: boolean;
}
