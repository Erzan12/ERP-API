import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "../guards/permission.guard";
import { SecurityClearanceGuard } from "../security_clearance/security-clearance.guard";

export const Authenticated = () => UseGuards(AuthGuard('jwt'), PermissionsGuard, SecurityClearanceGuard); // guardlogic for jwt token and auth