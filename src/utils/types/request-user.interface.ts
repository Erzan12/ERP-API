export interface RequestUser {
  id: string;
  email: string;
  department_id: string;
  security_clearance_level: number;
  roles: {
    id: string;
    name: string;
    sub_modules: {
      id: string;
      name: string;
      actions: string[]; // e.g ["view", "create", "delete"]
    }[];
  }[];
}
