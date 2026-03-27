import { CivilStatus, Gender } from '../../../../utils/decorators/global.enums.decorator';
export declare class CreatePersonDto {
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth: string;
    gender: Gender;
    civil_status: CivilStatus;
    email: string;
}
declare const UpdatePersonDto_base: import("@nestjs/common").Type<Partial<CreatePersonDto>>;
export declare class UpdatePersonDto extends UpdatePersonDto_base {
}
export {};
