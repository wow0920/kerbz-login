// response to /me, returns 404 always. assume it returns the same as /login if worked.
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  slug?: string | null;
  username?: string | null;
  phone?: string | null;
  dob?: string | null;
  is_over_25?: boolean;
  avatar?: string | null;
  public_avatar?: string;
  view_as_host?: boolean;
  host_info?: null;
  has_owner_role?: boolean;
  approved_to_drive?: boolean;
  has_license?: boolean;
  has_avatar?: boolean;
  is_ambassador?: boolean;
  can_pay?: boolean;
  email_verified_at?: string | null;
  timezone?: string | null;
}

// login response: assuming /me returns the same response if worked.
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface SessionState {
  token: string | null;
  user: UserInfo | null;
  lastActiveAt: number | null;
}
