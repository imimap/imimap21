import store from '@/store';
import decode, { JwtPayload } from 'jwt-decode';
import { UserState } from '@/store/types/UserState';
import { AxiosResponse } from 'axios';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import http from './http-common';

const AUTH_TOKEN_KEY = 'imimapAuthToken';
const REFRESH_TOKEN_KEY = 'imimapRefreshToken';

const getTokenExpirationDate = (encodedToken: string): Date | null => {
  try {
    const token: JwtPayload = decode(encodedToken);
    if (!token.exp) return null;
    const date = new Date(0);
    date.setUTCSeconds(token.exp);
    return date;
  } catch (error) {
    console.log('Error while decoding access token. Using null as expiration date.');
    return null;
  }
};

function isTokenExpired(token: string): boolean {
  const expirationDate: Date | null = getTokenExpirationDate(token);
  if (expirationDate != null) return expirationDate < new Date();
  return true;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token: string) {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearAuthToken() {
  http.defaults.headers.common.Authorization = '';
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const res = await http.post('/auth/refresh-token', { refreshToken });
    setAuthToken(res.data.token);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const authToken = getAuthToken();
  if (!authToken) {
    return false;
  }

  if (isTokenExpired(authToken)) {
    return refreshAccessToken();
  }
  return true;
}

export async function getUserInfo(): Promise<UserState> {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) throw new Error('User konnte nicht authentifiziert werden: Kein User ist eingeloggt. Bitte einloggen!');
  const token: string | null = getAuthToken();
  if (!token) throw new Error('User konnte nicht authentifiziert werden: Token konnte nicht gefunden werden.');
  // sometimes the http header will not have the Authorization header anymore,
  // so just to be safe we re-set it.
  setAuthToken(token);
  const decodedToken: UserState | null = decode(token);
  if (!decodedToken) throw new Error('User konnte nicht authentifiziert werden: Token konnte nicht dekodiert werden.');
  return decodedToken;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUserInfo();
  return !!user && user.role === 1;
}

export function logoutUser() {
  clearAuthToken();
  clearRefreshToken();
}

export async function storeAuthUser(decodedToken: UserState): Promise<void> {
  await store.dispatch('setUser', {
    email: decodedToken.email,
    firstName: decodedToken.firstName,
    id: decodedToken.id,
    lastName: decodedToken.lastName,
    sub: decodedToken.sub,
  });
}

export async function storeAuthUserProfile(userProfile: UserState): Promise<void> {
  await store.dispatch('setUserProfile', {
    ...userProfile,
  });
}

export async function getAuthUserProfile() {
  try {
    return await http.get('/auth/profile');
  } catch (err: any) {
    throw new Error(`Fehler beim Laden des Nutzer:innenprofils [ERROR: ${err.message}]`);
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  let res: AxiosResponse;
  try {
    res = await http.post('/auth/login', { username, password });
  } catch (err: any) {
    // TODO: Differentiate between errors
    await showErrorNotification(`Falsche Emailadresse oder Passwort: ${err.message}`);
    return false;
  }
  setAuthToken(res.data.token);
  setRefreshToken(res.data.refreshToken);
  let decodedToken: UserState;
  try {
    decodedToken = await getUserInfo();
  } catch (err: any) {
    await showErrorNotification('Authentifizierungstoken konnte nicht entschlüsselt werden.');
    return false;
  }
  try {
    await storeAuthUser(decodedToken);
    res = await getAuthUserProfile();
  } catch (err: any) {
    await showErrorNotification(err.message);
    return false;
  }
  try {
    await storeAuthUserProfile(res.data);
    await showSuccessNotification('Du wurdest erfolgreich eingeloggt!');
    return true;
  } catch (err: any) {
    await showErrorNotification(err.message);
  }
  return false;
}
