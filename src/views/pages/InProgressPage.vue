<template>
  <div class="page-layout">
    <AppHeader />
    <main class="page-main">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Content Recreation In Progress</h1>
            <p class="page-subtitle">
              Jobs the ingestion pipeline is currently working on. Updates every 5s.
            </p>
          </div>
          <div class="page-header-actions">
            <span class="last-polled" v-if="lastPolledAt">
              <i class="pi pi-clock"></i>
              Last updated {{ lastPolledLabel }}
            </span>
            <button class="btn-ghost" :disabled="loading" @click="pollNow">
              <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
              Refresh now
            </button>
          </div>
        </div>

        <section v-if="yoursJobs.length > 0" class="job-section">
          <h2 class="section-title">
            Your recent recreations
            <span class="section-count">{{ yoursJobs.length }}</span>
          </h2>
          <ul class="job-list">
            <li v-for="row in yoursJobs" :key="`yours-${row.id}`" class="job-row job-row--yours">
              <JobProgressRow :record="row" :is-yours="true" :now-ms="nowMs" />
            </li>
          </ul>
        </section>

        <section class="job-section">
          <h2 class="section-title">
            All currently running
            <span class="section-count">{{ otherJobs.length }}</span>
          </h2>
          <ul v-if="otherJobs.length > 0" class="job-list">
            <li v-for="row in otherJobs" :key="`all-${row.id}`" class="job-row">
              <JobProgressRow :record="row" :is-yours="false" :now-ms="nowMs" />
            </li>
          </ul>
          <div v-else-if="!loading" class="empty-state">
            <i class="pi pi-inbox empty-icon"></i>
            <p class="empty-text">No jobs are running right now.</p>
            <router-link to="/content-refreshed" class="empty-link">
              Go to Content Refreshed Pages
            </router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import JobProgressRow from '@/components/widgets/JobProgressRow.vue';
import { getRunningJobs, type ManualRecord } from '@/services/contentRefreshJobs';
import { getRecentRecreationIds } from '@/utils/recentRecreations';

const POLL_INTERVAL_MS = 5000;
const NOW_TICK_MS = 1000;

const records = ref<ManualRecord[]>([]);
const loading = ref(false);
const lastPolledAt = ref<Date | null>(null);
const nowMs = ref(Date.now());
const yoursIds = ref<Set<number>>(new Set());

let pollTimer: ReturnType<typeof setInterval> | null = null;
let nowTimer: ReturnType<typeof setInterval> | null = null;

const yoursJobs = computed(() =>
  records.value.filter((row) => yoursIds.value.has(row.id)),
);
const otherJobs = computed(() =>
  records.value.filter((row) => !yoursIds.value.has(row.id)),
);

const lastPolledLabel = computed(() => {
  if (!lastPolledAt.value) return '';
  const ageSec = Math.max(0, Math.floor((nowMs.value - lastPolledAt.value.getTime()) / 1000));
  if (ageSec < 5) return 'just now';
  if (ageSec < 60) return `${ageSec}s ago`;
  const minutes = Math.floor(ageSec / 60);
  return `${minutes}m ago`;
});

async function pollNow(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  try {
    const items = await getRunningJobs();
    records.value = items;
    lastPolledAt.value = new Date();
  } catch (err) {
    console.error('[InProgressPage] poll failed', err);
  } finally {
    loading.value = false;
  }
}

function refreshYoursIds(): void {
  yoursIds.value = getRecentRecreationIds();
}

onMounted(() => {
  refreshYoursIds();
  pollNow();
  pollTimer = setInterval(() => {
    pollNow();
    refreshYoursIds();
  }, POLL_INTERVAL_MS);
  nowTimer = setInterval(() => {
    nowMs.value = Date.now();
  }, NOW_TICK_MS);
});

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
  if (nowTimer) clearInterval(nowTimer);
  pollTimer = null;
  nowTimer = null;
});
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background: var(--color-bg);
}

.page-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.last-polled {
  font-size: 12px;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-ghost {
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

.btn-ghost:hover:not(:disabled) {
  color: var(--color-brand);
  border-color: var(--color-brand);
}

.btn-ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.job-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 12px 0;
}

.section-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  border-radius: 11px;
  background: var(--color-accent-light);
  color: var(--color-brand);
  font-size: 12px;
  font-weight: 600;
}

.job-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-row {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.job-row--yours {
  border-left: 3px solid var(--color-brand);
}

.empty-state {
  background: var(--color-white);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  color: var(--color-text-muted);
  opacity: 0.5;
  margin-bottom: 12px;
  display: inline-block;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0 0 12px 0;
}

.empty-link {
  font-size: 13px;
  color: var(--color-brand);
  text-decoration: none;
  font-weight: 500;
}

.empty-link:hover {
  text-decoration: underline;
}
</style>
