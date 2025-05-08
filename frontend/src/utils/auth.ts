import { jwtDecode } from 'jwt-decode';

// Token management
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Check if token is expired
export const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};