import { 
        IsNotEmpty,
        IsString
    } from "class-validator";
// import {
//     IsString({ each: true}),
//     IsNotEmpty,

// }

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString({})
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}