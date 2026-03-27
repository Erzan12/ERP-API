export declare class CreateUserLocationDto {
    location_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    province: string;
    country: string;
}
export declare class UpdateUserLocationDto {
    location_name?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    province?: string;
    country?: string;
    isActive?: boolean;
}
