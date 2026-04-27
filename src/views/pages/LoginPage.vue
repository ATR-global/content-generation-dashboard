<template>
  <div class="login-layout">
    <div class="login-card">
      <div class="login-brand">
        <img :src="logoSrc" alt="Logo" class="login-logo" />
      </div>
      <h1 class="login-title">Sign in</h1>
      <p class="login-subtitle">
        Enter the dashboard password to continue.
      </p>

      <form class="login-form" @submit.prevent="onSubmit">
        <label class="login-field">
          <span class="login-label">Password</span>
          <input
            ref="passwordInput"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="login-input"
            :disabled="submitting"
            required
          />
        </label>

        <div v-if="error" class="login-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>

        <button type="submit" class="login-submit" :disabled="submitting || !password">
          <i v-if="submitting" class="pi pi-spin pi-spinner"></i>
          {{ submitting ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import logoSrc from '@/assets/images/logo.svg';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const password = ref('');
const error = ref('');
const submitting = ref(false);
const passwordInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  passwordInput.value?.focus();
});

async function onSubmit() {
  if (!password.value || submitting.value) return;
  submitting.value = true;
  error.value = '';
  try {
    await login(password.value);
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/';
    router.replace(redirect);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Sign in failed.';
    password.value = '';
    passwordInput.value?.focus();
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(10, 37, 64, 0.08);
}

.login-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.login-logo {
  height: 28px;
  width: auto;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 6px 0;
  text-align: center;
}

.login-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0 0 24px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.login-input {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  transition: border-color 0.15s;
}

.login-input:focus {
  border-color: var(--color-brand);
}

.login-input:disabled {
  background: var(--color-bg-section);
  color: var(--color-text-muted);
}

.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 13px;
  color: #991b1b;
}

.login-error .pi {
  color: #dc2626;
  flex-shrink: 0;
}

.login-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.15s;
}

.login-submit:hover:not(:disabled) {
  background: var(--color-brand-hover);
}

.login-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
