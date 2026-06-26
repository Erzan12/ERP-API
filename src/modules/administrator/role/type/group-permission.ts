export type GroupedPermission = {
  id: string;
  actions: string[];
  sub_module: {
    id: string;
    name: string;
  };
};
