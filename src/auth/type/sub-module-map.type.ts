export interface SubModuleAction {
  subModulePermissionId: string | null;
  rolePermissionId: string | null;
  action: string;
  source: 'DIRECT' | 'ROLE';
}

export interface SubModule {
  subModuleId: string;
  name: string;
  actions: SubModuleAction[];
}
