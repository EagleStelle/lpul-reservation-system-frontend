export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  role: string;
  username: string;
  token: string;
  email: string;
  fullname: string;
  empId: string;
}

export interface AuthUser {
  username: string;
  role: string;
  email: string;
  fullname: string;
  empId: string;
}
