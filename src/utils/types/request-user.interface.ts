export interface RequestUser {
  id: string;
  email: string;
  department_id: string;
  security_clearance_level: number;
  roles: {
    id: string;
    name: string;
    // module: {
    //   id: number;
    //   name: string;
    // };
    permissions: {
      action: string;
      permission: {
        name: string;
      };
      // status: boolean;
    }[];
  }[];
  
}
