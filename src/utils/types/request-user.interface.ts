export interface RequestUser {
  id: string;
  email: string;
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
  security_clearance_level: number;
}
