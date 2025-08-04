//validators if permission or action dont exist in db
export const VALID_ACTIONS = [
    'create','read','update','delete','manage'
    // add others here like 'approve', 'cancel', etc.
];

export const ACTION_MAP: Record<string, string[]> = {
    manage: ['create', 'read', 'update', 'delete'], // customize this
    // optionally expand more meta-actions here add also in casl service
};