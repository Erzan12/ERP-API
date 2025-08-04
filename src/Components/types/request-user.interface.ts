export interface RequestUser {
  id: number;
  email: string;
  roles: {
    id: number;
    name: string;
    module: {
      id: number;
      name: string;
    };
    permissions: {
      action: string;
      permission: {
        name: string;
      };
      status: boolean;
    }[];
  }[];
}
