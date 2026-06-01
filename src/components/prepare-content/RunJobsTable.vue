<template>
  <section class="card">
    <header class="card-header">
      <h2 class="card-title">Jobs in this run</h2>
      <p class="card-subtitle">{{ jobs.length }} total</p>
    </header>
    <div class="card-body card-body--table">
      <table v-if="jobs.length > 0" class="jobs-table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Model</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Status</th>
            <th>Score</th>
            <th>Started</th>
            <th>Updated</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id" :class="`row-status-${job.status}`">
            <td>
              <a v-if="job.permalink" :href="job.permalink" target="_blank" rel="noopener">#{{ job.id }}</a>
              <span v-else>#{{ job.id }}</span>
            </td>
            <td>{{ job.modelNumber || '—' }}</td>
            <td>{{ job.brand || '—' }}</td>
            <td>{{ job.productType || '—' }}</td>
            <td><span class="status-pill" :class="`status-pill--${job.status}`">{{ job.status }}</span></td>
            <td>{{ job.contentScore !== null ? job.contentScore.toFixed(2) : '—' }}</td>
            <td>{{ formatTs(job.startedAt) }}</td>
            <td>{{ formatTs(job.completedAt) }}</td>
            <td class="error-cell" :title="job.errorMessage || ''">
              {{ truncate(job.errorMessage, 60) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">No jobs are associated with this run.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RunJob } from '@/services/prepareContentRefreshJobs';

defineProps<{
  jobs: RunJob[];
}>();

function formatTs(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return value;
  }
}

function truncate(value: string | null, max: number): string {
  if (!value) return '—';
  return value.length > max ? value.slice(0, max) + '…' : value;
}
</script>

<style scoped>
.card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 16px; }
.card-header { padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.card-title { font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0 0 4px 0; }
.card-subtitle { font-size: 12px; color: var(--color-text-muted); margin: 0; }
.card-body--table { padding: 0; overflow-x: auto; }
.jobs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.jobs-table th, .jobs-table td {
  text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--color-border); white-space: nowrap;
}
.jobs-table th { background: var(--color-bg); font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.3px; }
.error-cell { white-space: normal; max-width: 280px; }
.status-pill {
  display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 11px;
  background: var(--color-bg); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.3px;
}
.status-pill--published { background: #bbf7d0; color: #166534; }
.status-pill--processing { background: #bfdbfe; color: #1e40af; }
.status-pill--pending { background: #fde68a; color: #854d0e; }
.status-pill--failed, .status-pill--missing_fields, .status-pill--incorrect_manual { background: #fecaca; color: #991b1b; }
.empty { padding: 24px; color: var(--color-text-muted); text-align: center; }
</style>
