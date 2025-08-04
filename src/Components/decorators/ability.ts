//permissions or action
export const MODULE_ADMIN = 'Administrator';
export const MODULE_HR = 'Human Resources';
export const MODULE_MNGR = 'Managers Access';
export const MODULE_COPR_SERV = 'Corporate Services';
export const MODULE_PAYROLL = 'Payroll';
export const MODULE_PURCHASING = 'Purchasing';
export const MODULE_INVENTORY = 'Inventory';
export const MODULE_ACCOUNTING = 'Accounting';
export const MODULE_FINANCE = 'Finance';
export const MODULE_MRKTOPS = 'Marketing and Operations';
export const MODULE_AST_MGT = 'Asset Management';
export const MODULE_COMPLIANCE = 'Compliance';
export const MODULE_IT = 'IT Helpdesk';

// permission flow -> check user role -> permission can create? -> module manager? -> submodule useraccount
export const UserRole = {
    ADMINISTRATOR            : 'Administrator',
    HUMAN_RESOURCES          : 'Human Resources',
    PAYROLL                  : 'Payroll',
    PURCHASING               : 'Purchasing',
    INVENTORY                : 'Inventory',
    ACCOUNTING               : 'Accounting',
    OPERATIONS               : 'Operations',
    FINANCE                  : 'Finance',
    ASSET_MANAGEMENT         : 'Asset Management',
    COMPLIANCE               : 'Compliance',
    INFORMATION_TECHNOLOGY   : 'Information Technology',
    MANAGERS                 : 'Manager',
    EPORTAL_USER             : 'Eportal User',
}

//actions or permissions kani nga permission sa user padolung sa user account then unsay mabuhat niya under sa user account submodule
export const ACTION_CREATE = 'create';
export const ACTION_READ   = 'read';
export const ACTION_UPDATE = 'update';
export const ACTION_DELETE = 'delete';
export const ACTION_MANAGE = 'manage';
export const ACTION_VERIFY = 'verify';
export const ACTION_ACCESS = 'access';
// export const ACTION_CANCEL = 'cancel';
// export const ACTION_EDIT = 'edit';
// export const ACTION_APPROVE= 'approve';
// export const ACTION_NOTE = 'note';

export const USER_TOKEN_STATUS = {
    UNASSIGNED : 'true',
    DEACTIVATED : 'false',
}

export const PASSWORD_RESET_TOKEN = {
    USED : 'true',
    UNUSED : 'false',
}
