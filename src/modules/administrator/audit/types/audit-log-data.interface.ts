import { RequestUser } from 'src/utils/types/request-user.interface';

export interface AuditLogData {
  user?: RequestUser;
  action: string;
  resource: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  changed_fields?: string[]; //new: explicit field tracking
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  http_method?: string;
  status_code?: number;
  success?: boolean;
  error_message?: string;
  department_id?: string; //new: department tracking
  session_id?: string;
  request_id?: string; //new: correlate operations
  severity?: 'INFO' | 'WARNING' | 'CRITICAL'; //new: severity levels
  compliance_flag?: boolean; //new: compliance tracking
}
