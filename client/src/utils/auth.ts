import decode, { JwtPayload } from 'jwt-decode';
import { UserState } from '@/store/types/UserState';
import http from './http-common';

const AUTH_TOKEN_KEY = 'imimapAuthToken';

const getTokenExpirationDate = (encodedToken): Date | null => {
  const token: JwtPayload = decode(encodedToken);
  if (!token.exp) return null;
  const date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
};

function isTokenExpired(token): boolean {
  const expirationDate: Date | null = getTokenExpirationDate(token);
  if (expirationDate != null) return expirationDate < new Date();
  return true;
}

export function getAuthToken(): string | null {
  const token: string | null = localStorage.getItem(AUTH_TOKEN_KEY);
  return token;
}

export function setAuthToken(token) {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  http.defaults.headers.common.Authorization = '';
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  const authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}

export function getUserInfo(): UserState | null {
  const token: string | null = getAuthToken();
  if (isLoggedIn() && token != null) return decode(token);
  return null;
}

export function logoutUser() {
  clearAuthToken();
}
