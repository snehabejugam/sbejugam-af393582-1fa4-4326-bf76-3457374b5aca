export interface User {
  id: number;
  email: string;
  name: string;
  password?: string; // Optional for frontend
  roleId: number;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  roleId: number;
  organizationId: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}