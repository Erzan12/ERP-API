export interface NewUserData {
  id: string;
  email: string;
  username?: string | null;
  employee_id: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  security_clearance_level?: number | null;
  // optional: anything else you care to log on creation
}
