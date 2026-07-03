// export type GroupedPermission = {
//   id: string;
//   actions: string[];
//   sub_module: {
//     id: string;
//     name: string;
//   };
// };

export type GroupedPermission = {
  id: string;
  actions: {
    role_permission_id: string;
    sub_module_permission_id: string;
    action: string;
  }[];
  sub_module: {
    id: string;
    name: string;
  };
};