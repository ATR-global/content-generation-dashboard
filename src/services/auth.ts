import { httpGet, httpPost } from './httpService';

export async function login(password: string): Promise<void> {
  await httpPost<{ success: true }>('/auth/login', { password });
}

export async function logout(): Promise<void> {
  await httpPost<{ success: true }>('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  try {
    await httpGet<{ success: true; authenticated: true }>('/auth/me');
    return true;
  } catch {
    return false;
  }
}
