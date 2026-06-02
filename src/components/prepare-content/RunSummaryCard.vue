<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">
          Step 2 — Refresh
          <span class="status-chip" :class="`status-chip--${run.status}`">{{ statusLabel }}</span>
        </h2>
        <p class="card-subtitle">
          {{ run.jobIds.length }} job(s) prepared from
          <strong>{{ run.categoryName || run.categorySlug || `category #${run.categoryId}` }}</strong>
          · brand <strong>{{ run.brandName || run.brandId }}</strong>
          · type <strong>{{ run.productTypeName || run.productTypeId }}</strong>
        </p>
      </div>
      <div class="card-actions-inline">
        <button
          v-if="run.status === 'prepared'"
          type="button"
          class="btn-primary"
          :disabled="starting || run.jobIds.length === 0"
          @click="$emit('start-refresh')"
        >
          <i class="pi" :class="starting ? 'pi-spin pi-spinner' : 'pi-play'"></i>
          {{ starting ? 'Starting…' : 'Start Refresh' }}
        </button>
        <button v-if="canClose" type="button" class="btn-ghost" @click="$emit('close-run')">
          <i class="pi pi-times"></i>
          Close run
        </button>
      </div>
    </header>

    <div class="card-body">
      <div class="progress-row">
        <div class="progress-label">
          <span>{{ counters.terminal }} / {{ counters.total }} done</span>
          <span class="progress-pct">{{ percent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${percent}%` }"></div>
        </div>
      </div>

      <ul class="counter-list">
        <li class="counter counter--pending">
          <span class="counter-label">Pending</span>
          <span class="counter-value">{{ counters.pending + counters.content_ready + counters.content_error }}</span>
        </li>
        <li class="counter counter--processing">
          <span class="counter-label">Processing</span>
          <span class="counter-value">{{ counters.processing }}</span>
        </li>
        <li class="counter counter--published">
          <span class="counter-label">Published</span>
          <span class="counter-value">{{ counters.published }}</span>
        </li>
        <li class="counter counter--failed">
          <span class="counter-label">Failed</span>
          <span class="counter-value">{{ counters.failed }}</span>
        </li>
        <li class="counter counter--missing">
          <span class="counter-label">Missing fields</span>
          <span class="counter-value">{{ counters.missing_fields }}</span>
        </li>
        <li class="counter counter--incorrect">
          <span class="counter-label">Incorrect manual</span>
          <span class="counter-value">{{ counters.incorrect_manual }}</span>
        </li>
        <li class="counter counter--manual-missing">
          <span class="counter-label">Manual missing</span>
          <span class="counter-value">{{ counters.manual_does_not_exist }}</span>
        </li>
      </ul>

      <div v-if="lastPolledLabel" class="poll-meta">
        <i class="pi pi-clock"></i>
        Last updated {{ lastPolledLabel }}
        <button type="button" class="link" @click="$emit('poll-now')">Refresh now</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RunRecord, RunCounters } from '@/services/prepareContentRefreshJobs';

const props = defineProps<{
  run: RunRecord;
  counters: RunCounters;
  starting: boolean;
  lastPolledAt: Date | null;
  now: number;
}>();

defineEmits<{
  (e: 'start-refresh'): void;
  (e: 'close-run'): void;
  (e: 'poll-now'): void;
}>();

const statusLabel = computed(() => {
  switch (props.run.status) {
    case 'prepared': return 'Prepared';
    case 'refreshing': return 'Refreshing';
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
    default: return props.run.status;
  }
});

const percent = computed(() => {
  if (props.counters.total === 0) return 0;
  return Math.round((props.counters.terminal / props.counters.total) * 100);
});

const canClose = computed(() => props.run.status === 'completed' || props.run.status === 'failed');

const lastPolledLabel = computed(() => {
  if (!props.lastPolledAt) return '';
  const diffMs = Math.max(0, props.now - props.lastPolledAt.getTime());
  const sec = Math.round(diffMs / 1000);
  if (sec < 5) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
});
</script>

<style scoped>
.card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 16px; }
.card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 16px 20px; border-bottom: 1px solid var(--color-border); gap: 16px;
}
.card-title { font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0 0 4px 0; display: flex; align-items: center; gap: 10px; }
.card-subtitle { font-size: 12px; color: var(--color-text-muted); margin: 0; }
.card-actions-inline { display: flex; gap: 8px; flex-shrink: 0; }
.card-body { padding: 16px 20px; }

.status-chip {
  font-size: 11px; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.3px;
}
.status-chip--prepared { background: #fde68a; color: #854d0e; }
.status-chip--refreshing { background: #bfdbfe; color: #1e40af; }
.status-chip--completed { background: #bbf7d0; color: #166534; }
.status-chip--failed { background: #fecaca; color: #991b1b; }

.progress-row { margin-bottom: 14px; }
.progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px; }
.progress-pct { font-weight: 600; }
.progress-bar { background: var(--color-bg); height: 8px; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-brand); transition: width 0.3s ease; }

.counter-list { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; padding: 0; margin: 0 0 12px 0; list-style: none; }
.counter { background: var(--color-bg); border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
.counter-label { font-size: 11px; color: var(--color-text-muted); }
.counter-value { font-size: 18px; font-weight: 600; color: var(--color-primary); }
.counter--published .counter-value { color: #166534; }
.counter--failed .counter-value, .counter--missing .counter-value, .counter--incorrect .counter-value { color: #991b1b; }
.counter--manual-missing .counter-value { color: #475569; }

.poll-meta { font-size: 12px; color: var(--color-text-muted); display: inline-flex; align-items: center; gap: 6px; }
.btn-primary, .btn-ghost {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
}
.btn-primary { background: var(--color-brand); color: var(--color-white); border: 1px solid var(--color-brand); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-ghost { background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn-ghost:hover { color: var(--color-brand); border-color: var(--color-brand); }
.link { background: none; border: none; padding: 0; color: var(--color-brand); cursor: pointer; text-decoration: underline; }
</style>
