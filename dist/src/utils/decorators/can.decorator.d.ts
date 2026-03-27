export declare const PERMISSIONS_KEY = "permissions";
export interface PermissionMetadata {
    action: string;
    subject: string;
}
export declare const Can: (permission: PermissionMetadata) => import("@nestjs/common").CustomDecorator<string>;
