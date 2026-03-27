import { UserLocationService } from './user_location.service';
import { CreateUserLocationDto, UpdateUserLocationDto } from './dto/user-location.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class UserLocationControllerV2 {
    private userLocationService;
    constructor(userLocationService: UserLocationService);
    getUserLocations(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        userLocations: ({
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
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            country: string | null;
            location_name: string;
            address_line_1: string | null;
            address_line_2: string | null;
            city: string | null;
            province: string | null;
        })[];
    }>;
    getUserLocation(userLocationId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        user_location: {
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
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            country: string | null;
            location_name: string;
            address_line_1: string | null;
            address_line_2: string | null;
            city: string | null;
            province: string | null;
        };
    }>;
    createUserLocation(createUserLocationDto: CreateUserLocationDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        userLocation: {
            id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            country: string | null;
            location_name: string;
            address_line_1: string | null;
            address_line_2: string | null;
            city: string | null;
            province: string | null;
        };
        created_by_user: string;
    }>;
    updateUserLocation(userLocationId: string, updateUserLocationDto: UpdateUserLocationDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updateUserLocation: {
            id: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            country: string | null;
            location_name: string;
            address_line_1: string | null;
            address_line_2: string | null;
            city: string | null;
            province: string | null;
        };
        updated_by: string;
    }>;
}
