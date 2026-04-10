<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-brand">
        <span class="brand-title">Content Pipeline</span>
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
    </div>
  </header>
</template>

<script setup lang="ts">
const tabs = [
  { to: '/', routeName: 'Dashboard', label: 'Dashboard', icon: 'pi pi-chart-pie' },
  {
    to: '/content-refreshed',
    routeName: 'ContentRefreshed',
    label: 'Content Refreshed Pages',
    icon: 'pi pi-file-edit',
  },
];
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

.brand-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.3px;
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
</style>
