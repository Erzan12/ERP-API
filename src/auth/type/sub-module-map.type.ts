export interface SubModuleAction {
  subModulePermissionId: string | null;
  rolePermissionId: string | null;
  action: string;
  source: 'direct' | 'role';
}

export interface SubModule {
  subModuleId: string;
  name: string;
  actions: SubModuleAction[];
}
