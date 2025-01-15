export interface LoginForm {
    email: string;
    password: string;
  }
  
export interface AuthResponse {
status: string;
message: string;
token?: string;
}