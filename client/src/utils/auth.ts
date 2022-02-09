import store from '@/store';
import decode, { JwtPayload } from 'jwt-decode';
import { UserState } from '@/store/types/UserState';
import { AxiosResponse } from 'axios';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
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

function setAuthToken(token: string) {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearAuthToken() {
  http.defaults.headers.common.Authorization = '';
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  const authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}

export function getUserInfo(): UserState {
  if (!isLoggedIn()) throw new Error('User konnte nicht authentifiziert werden: Kein User ist eingeloggt. Bitte einloggen!');
  const token: string | null = getAuthToken();
  if (!token) throw new Error('User konnte nicht authentifiziert werden: Token konnte nicht gefunden werden.');
  const decodedToken: UserState | null = decode(token);
  if (!decodedToken) throw new Error('User konnte nicht authentifiziert werden: Token konnte nicht dekodiert werden.');
  return decodedToken;
}

export function isAdmin(): boolean {
  const user = getUserInfo();
  return !!user && user.role === 1;
}

export function logoutUser() {
  clearAuthToken();
}

export async function storeAuthUser(decodedToken): Promise<void> {
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
  let decodedToken;
  try {
    decodedToken = getUserInfo();
  } catch (err: any) {
    await showErrorNotification('Authentifizierungstoken konnte nicht entschlüsselt werden.');
    return false;
  }
  await storeAuthUser(decodedToken);
  try {
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
