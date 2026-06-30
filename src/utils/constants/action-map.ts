//validators if permission or action dont exist in db FOR PERMISSION GUARD CHECK
export const VALID_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'note',
  'verify',
  'approve',
  'submit',
  'process',
  'reject',
  'cancel',
  'accept',
  'onboard',
  'manage',
  // add others here like 'approve', 'cancel', 'manage', etc.
];

//FOR CASL CHECK
export const ACTION_MAP: Record<string, string[]> = {
  manage: [
    'create',
    'read',
    'update',
    'delete',
    'note',
    'verify',
    'approve',
    'submit',
    'process',
    'reject',
    'cancel',
    'accept',
    'onboard',
  ], // customize this
  // optionally expand more meta-actions here add also in casl service
};
