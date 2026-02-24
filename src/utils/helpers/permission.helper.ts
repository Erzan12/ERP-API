// permission.helpers.ts
import { Can } from '../decorators/can.decorator';

export const Read = (subject: string): MethodDecorator =>
  Can({ action: 'read', subject });

export const Create = (subject: string): MethodDecorator =>
  Can({ action: 'create', subject });

export const Update = (subject: string): MethodDecorator =>
  Can({ action: 'update', subject });

export const Delete = (subject: string): MethodDecorator =>
  Can({ action: 'delete', subject });
