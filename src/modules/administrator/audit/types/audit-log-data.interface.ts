import { RequestUser } from 'src/utils/types/request-user.interface';

export interface AuditLogData {
  user?: RequestUser;
  action: string;
  resource: string;
  resource_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  changed_fields?: string[];
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  http_method?: string;
  status_code?: number;
  success?: boolean;
  error_message?: string;
  department_id?: string;
  session_id?: string;
  request_id?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  compliance_flag?: boolean;
}
