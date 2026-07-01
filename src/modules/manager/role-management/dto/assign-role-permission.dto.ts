import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignDirectPermissionDto {
    @IsUUID()
    @ApiProperty({ example: "PK UUID", description: 'PK UUID of the user role' })
    role_id: string;

    @IsUUID()
    @ApiProperty({ example: "PK UUID", description: 'PK UUID of the sub module permission' })
    sub_module_permission_id: string;
}

export class AssignCustomRolePermissiontDto {
    @IsUUID()
    @ApiProperty({ example: "PK UUID", description: 'PK UUID of user role' })
    role_id: string;

    @IsUUID()
    @ApiProperty({ example: "PK UUID", description: 'PK UUID of role permission' })
    role_permission_id: string;
}