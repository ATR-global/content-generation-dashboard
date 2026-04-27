<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-brand">
        <img :src="logoSrc" alt="Logo" class="brand-logo" />
      </div>
      <nav class="header-nav">
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="nav-tab"
          :class="{ active: $route.name === tab.routeName }"
        >
          <i :class="tab.icon" class="nav-tab-icon"></i>
          {{ tab.label }}
        </router-link>
      </nav>
      <div class="header-actions">
        <button
          class="logout-btn"
          :disabled="loggingOut"
          @click="onLogout"
          v-tippy="'Sign out'"
        >
          <i class="pi pi-sign-out"></i>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logoSrc from '@/assets/images/logo.svg';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { logout } = useAuth();
const loggingOut = ref(false);

const tabs = [
  { to: '/', routeName: 'Dashboard', label: 'Dashboard', icon: 'pi pi-chart-pie' },
  {
    to: '/content-refreshed',
    routeName: 'ContentRefreshed',
    label: 'Content Refreshed Pages',
    icon: 'pi pi-file-edit',
  },
];

async function onLogout() {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    await logout();
  } finally {
    loggingOut.value = false;
    router.replace({ name: 'Login' });
  }
}
</script>

<style scoped>
.app-header {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 56px;
  gap: 32px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 22px;
  width: auto;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.3px;
  border-left: 1px solid var(--color-border);
  padding-left: 12px;
}

.header-nav {
  display: flex;
  gap: 4px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-tab:hover {
  color: var(--color-brand);
  background: var(--color-accent-light);
}

.nav-tab.active {
  color: var(--color-brand);
  background: var(--color-accent-light);
}

.nav-tab-icon {
  font-size: 14px;
}

.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.logout-btn:hover:not(:disabled) {
  color: var(--color-brand);
  border-color: var(--color-brand);
}

.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
