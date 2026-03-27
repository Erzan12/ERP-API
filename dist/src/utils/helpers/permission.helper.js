"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Update = exports.Create = exports.Read = void 0;
const can_decorator_1 = require("../decorators/can.decorator");
const Read = (subject) => (0, can_decorator_1.Can)({ action: 'read', subject });
exports.Read = Read;
const Create = (subject) => (0, can_decorator_1.Can)({ action: 'create', subject });
exports.Create = Create;
const Update = (subject) => (0, can_decorator_1.Can)({ action: 'update', subject });
exports.Update = Update;
const Delete = (subject) => (0, can_decorator_1.Can)({ action: 'delete', subject });
exports.Delete = Delete;
//# sourceMappingURL=permission.helper.js.map