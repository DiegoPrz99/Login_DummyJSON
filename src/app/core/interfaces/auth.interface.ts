export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  expiresIn?: number;
  [key: string]: any;
}
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  [key: string]: any;
}
