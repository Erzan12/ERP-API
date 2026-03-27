import { RequestUser } from '../../../utils/types/request-user.interface';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { ModuleService } from './module.service';
export declare class ModuleControllerV2 {
    private moduleService;
    constructor(moduleService: ModuleService);
    getModules(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        modules: ({
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
            sub_module: {
                id: string;
                name: string;
                is_active: boolean;
            }[];
        } & {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        })[];
    }>;
    getModule(user: RequestUser, moduleId: string): Promise<{
        status: string;
        message: string;
        data: {
            module: {
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
                sub_module: {
                    id: string;
                    name: string;
                    is_active: boolean;
                }[];
            } & {
                id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
            };
        };
    }>;
    createModule(createModuleDto: CreateModuleDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        module: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        };
        created_by_user: string;
    }>;
    updateModule(updateModuleDto: UpdateModuleDto, user: RequestUser, id: string): Promise<{
        status: string;
        message: string;
        updatedModule: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        };
        updated_by_user: string;
    }>;
}
