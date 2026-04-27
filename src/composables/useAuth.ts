import { ref } from 'vue';
import * as authApi from '@/services/auth';

const isAuthenticated = ref(false);
const initialized = ref(false);
const checking = ref(false);

async function ensureChecked(): Promise<boolean> {
  if (initialized.value) return isAuthenticated.value;
  if (checking.value) {
    while (checking.value) {
      await new Promise((r) => setTimeout(r, 25));
    }
    return isAuthenticated.value;
  }
  checking.value = true;
  try {
    isAuthenticated.value = await authApi.checkSession();
    initialized.value = true;
    return isAuthenticated.value;
  } finally {
    checking.value = false;
  }
}

async function login(password: string): Promise<void> {
  await authApi.login(password);
  isAuthenticated.value = true;
  initialized.value = true;
}

async function logout(): Promise<void> {
  try {
    await authApi.logout();
  } finally {
    isAuthenticated.value = false;
    initialized.value = true;
  }
}

function markUnauthenticated(): void {
  isAuthenticated.value = false;
  initialized.value = true;
}

export function useAuth() {
  return {
    isAuthenticated,
    initialized,
    ensureChecked,
    login,
    logout,
    markUnauthenticated,
  };
}
