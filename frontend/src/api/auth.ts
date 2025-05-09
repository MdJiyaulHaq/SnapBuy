import api from "./index";
import {
  LoginCredentials,
  TokenResponse,
  RegisterData,
  User,
} from "../types/api";

export const login = async (
  credentials: LoginCredentials
): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>(
    "/auth/jwt/create/",
    credentials
  );
  return response.data;
};

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await api.post<User>("/auth/users/", userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User[]>("/auth/users/me/");
  return response.data[0];
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.patch<User>("/auth/users/me/", userData);
  return response.data;
};
