import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "../guards/permission.guard";

export const Authenticated = () => UseGuards(AuthGuard('jwt'), PermissionsGuard); // guardlogic for jwt token and auth