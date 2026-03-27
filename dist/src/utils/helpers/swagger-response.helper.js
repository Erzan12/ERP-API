"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPostResponse = ApiPostResponse;
exports.ApiGetResponse = ApiGetResponse;
exports.ApiPatchResponse = ApiPatchResponse;
exports.ApiLoginResponse = ApiLoginResponse;
exports.ApiDeactivateResponse = ApiDeactivateResponse;
exports.ApiActivateResponse = ApiActivateResponse;
exports.ApiSecurityClearance = ApiSecurityClearance;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const BadRequest = {
    status: 400,
    description: 'Bad Request - Invalid or missing input or parameters',
};
const Unauthorized = {
    status: 401,
    description: 'Unauthorized - You do not have access to this resource',
};
const Forbidden = {
    status: 403,
    description: 'Forbidden - You do not have access to this resource',
};
const NotFound = {
    status: 404,
    description: 'Not Found - The requested resource was not found.',
};
const UserNotFound = {
    status: 404,
    description: 'Not Found - User not found',
};
const Conflict = {
    status: 409,
    description: 'Conflict - Resource already exist or duplicate entry',
};
const InternalServerError = {
    status: 500,
    description: 'Internal Server Error',
};
function ApiPostResponse(description = 'Resource created successfully') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 201, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(Forbidden), (0, swagger_1.ApiResponse)(Conflict), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiGetResponse(description = 'Resource(s) fetch successfully') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 200, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(Forbidden), (0, swagger_1.ApiResponse)(NotFound), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiPatchResponse(description = 'Resource updated successfully') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 200, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(Forbidden), (0, swagger_1.ApiResponse)(NotFound), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiLoginResponse(description = 'Login successfully - returns JWT Token') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 201, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(UserNotFound), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiDeactivateResponse(description = 'Resource deactivated successfully') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 200, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(Forbidden), (0, swagger_1.ApiResponse)(NotFound), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiActivateResponse(description = 'Resource activated successfully') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 200, description }), (0, swagger_1.ApiResponse)(BadRequest), (0, swagger_1.ApiResponse)(Unauthorized), (0, swagger_1.ApiResponse)(Forbidden), (0, swagger_1.ApiResponse)(NotFound), (0, swagger_1.ApiResponse)(InternalServerError));
}
function ApiSecurityClearance(level) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: `Requires Security Clearance Level ${level}`,
        description: `This endpoint requires a minimun security clearance of level ${level}.`,
    }));
}
//# sourceMappingURL=swagger-response.helper.js.map