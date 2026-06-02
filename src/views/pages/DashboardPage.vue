<template>
  <div class="dashboard-layout">
    <AppHeader />
    <main class="dashboard-main">
      <div class="dashboard-content">
        <h1 class="page-title">Dashboard</h1>

        <!-- KPI Summary Cards -->
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--total">
              <i class="pi pi-book"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ totalRefresh.toLocaleString() }}</span>
              <span class="kpi-label">Total Manuals</span>
            </div>
          </div>
          <router-link to="/content-refreshed" class="kpi-card kpi-card--link">
            <div class="kpi-icon kpi-icon--review">
              <i class="pi pi-eye"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ forReviewCount }}</span>
              <span class="kpi-label">For Review</span>
            </div>
            <i class="pi pi-arrow-right kpi-arrow"></i>
          </router-link>
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--errors">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ errorCount }}</span>
              <span class="kpi-label">Needs Attention</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--score">
              <i class="pi pi-star"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ avgScore }}</span>
              <span class="kpi-label">Avg. Score</span>
            </div>
          </div>
        </div>

        <!-- Main grid: Chart + Needs Attention -->
        <div class="cards-grid">
          <!-- Manual Ingestion Status (disabled for now)
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Manual Ingestion Status</h2>
              <span class="status-chip status-chip--running">
                <i class="pi pi-spin pi-spinner"></i> Running
              </span>
            </div>
            <div class="card-body chart-container">
              <canvas ref="pieChartCanvas"></canvas>
            </div>
            <div class="chart-legend">
              <div
                v-for="(label, i) in chartData.labels"
                :key="label"
                class="legend-item"
              >
                <span class="legend-dot" :style="{ background: chartColors[i] }"></span>
                <span class="legend-label">{{ label }}</span>
                <span class="legend-value">{{ chartData.values[i] }}</span>
              </div>
            </div>
          </div>
          -->

          <!-- Page Content Refresh Status -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Page Content Refresh Status</h2>
              <span class="status-chip status-chip--online">
                <i class="pi pi-circle-fill"></i> Online
              </span>
            </div>
            <div class="card-body chart-container">
              <canvas ref="refreshChartCanvas"></canvas>
            </div>
            <div class="chart-legend">
              <div
                v-for="(label, i) in refreshChartData.labels"
                :key="'refresh-' + label"
                class="legend-item"
              >
                <span class="legend-dot" :style="{ background: refreshChartData.colors[i] }"></span>
                <span class="legend-label">{{ label }}</span>
                <span class="legend-value">{{ refreshChartData.values[i] }}</span>
              </div>
            </div>
          </div>

          <!-- Needs Attention -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Needs Attention</h2>
              <span class="attention-count">{{ attentionItems.length }} items</span>
            </div>
            <div class="card-body card-body--flush">
              <div v-if="attentionItems.length === 0" class="empty-state">
                <i class="pi pi-check-circle empty-state-icon"></i>
                <span>No items need attention</span>
              </div>
              <div v-else class="attention-list">
                <div
                  v-for="item in attentionItems"
                  :key="item.id"
                  class="attention-row"
                >
                  <span class="status-tag" :class="'status--' + item.status">
                    {{ statusLabels[item.status] || item.status }}
                  </span>
                  <span class="attention-title" :title="item.title">{{ item.title }}</span>
                  <span class="attention-score" :class="scoreClass(item.score)">
                    {{ item.score }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="attentionItems.length > 0" class="card-footer">
              <router-link to="/content-refreshed" class="view-all-link">
                View all in Content Refreshed Pages
                <i class="pi pi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div class="card card--full">
          <div class="card-header">
            <h2 class="card-title">Task List</h2>
            <span class="card-subtitle">Content refresh tasks</span>
          </div>
          <div class="card-body card-body--flush">
            <table class="mini-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.name">
                  <td>
                    <div class="task-name-cell">
                      <i class="pi" :class="taskIcon(task.status)"></i>
                      <span>{{ task.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="task-status" :class="'task-status--' + task.status">
                      {{ taskStatusLabel(task.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card card--full">
          <div class="card-header">
            <h2 class="card-title">Recent Activity</h2>
            <span class="card-subtitle">Latest processed manuals</span>
          </div>
          <div class="card-body card-body--flush">
            <table class="mini-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Type</th>
                  <th>Pages</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recentItems" :key="item.id">
                  <td class="mini-title-cell">
                    <span class="mini-title">{{ item.title }}</span>
                    <span class="mini-meta">ID {{ item.id }} &middot; WP #{{ item.wpPageId }}</span>
                  </td>
                  <td>
                    <span class="status-tag" :class="'status--' + item.status">
                      {{ statusLabels[item.status] || item.status }}
                    </span>
                  </td>
                  <td>
                    <span class="score-badge" :class="'score--' + scoreClass(item.score)">
                      {{ item.score }}
                    </span>
                  </td>
                  <td class="mini-muted">{{ item.metaApplianceType }}</td>
                  <td class="mini-muted">{{ item.metaPages }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import AppHeader from '@/components/common/AppHeader.vue';
import { allStatuses, statusLabels, statusColors } from '@/data/statusLabels';
import {
  getStats,
  getRecent,
  getNeedsAttention,
  type ManualRecord,
} from '@/services/contentRefreshJobs';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const counts = ref<Record<string, number>>({});
const totalRefresh = ref(0);
const forReviewCount = ref(0);
const errorCount = ref(0);
const avgScore = ref<string>('—');
const attentionItems = ref<ManualRecord[]>([]);
const recentItems = ref<ManualRecord[]>([]);

const refreshChartData = computed(() => {
  const labels: string[] = [];
  const values: number[] = [];
  const colors: string[] = [];
  for (const status of allStatuses) {
    const count = counts.value[status] || 0;
    if (count === 0 && status !== 'published') continue;
    labels.push(statusLabels[status] || status);
    values.push(count);
    colors.push(statusColors[status] || '#94a3b8');
  }
  return { labels, values, colors };
});

type TaskStatus = 'open' | 'in_progress' | 'done';

interface PipelineTask {
  name: string;
  status: TaskStatus;
}

const tasks: PipelineTask[] = [
  { name: 'Refresh content for GE Ranges', status: 'done' },
  { name: 'Refresh content for GE Refrigerators', status: 'in_progress' },
  { name: 'Refresh content for GE Dishwashers', status: 'open' },
];

function taskIcon(status: TaskStatus): string {
  if (status === 'done') return 'pi-check-circle';
  if (status === 'in_progress') return 'pi-spin pi-spinner';
  return 'pi-circle';
}

function taskStatusLabel(status: TaskStatus): string {
  if (status === 'done') return 'Done';
  if (status === 'in_progress') return 'In Progress';
  return 'Open';
}

function scoreClass(score: number | null): string {
  if (score === null || score === undefined) return 'low';
  if (score >= 8.5) return 'high';
  if (score >= 7.0) return 'mid';
  return 'low';
}

const refreshChartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function renderChart() {
  if (!refreshChartCanvas.value) return;
  const { labels, values, colors } = refreshChartData.value;
  const total = values.reduce((a, b) => a + b, 0);
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(refreshChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed;
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

onMounted(async () => {
  try {
    const [stats, recent, attention] = await Promise.all([
      getStats(),
      getRecent(7),
      getNeedsAttention(20),
    ]);

    counts.value = stats.counts;
    totalRefresh.value = stats.totalJobs;
    forReviewCount.value = stats.forReviewCount;
    errorCount.value = stats.errorCount;
    avgScore.value = stats.avgScore !== null ? stats.avgScore.toFixed(2) : '—';
    recentItems.value = recent;
    attentionItems.value = attention;

    renderChart();
  } catch (err) {
    console.error('[DashboardPage] failed to load dashboard data', err);
  }
});
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: var(--color-bg);
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 24px 0;
}

/* KPI Cards */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-decoration: none;
  transition: box-shadow 0.15s;
}

.kpi-card--link {
  cursor: pointer;
}

.kpi-card--link:hover {
  box-shadow: 0 2px 12px rgba(0, 119, 230, 0.1);
  border-color: var(--color-brand);
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon .pi {
  font-size: 18px;
}

.kpi-icon--total {
  background: #ebf5ff;
  color: var(--color-brand);
}

.kpi-icon--review {
  background: #e0f7fa;
  color: #00838f;
}

.kpi-icon--errors {
  background: #fef2f2;
  color: #dc2626;
}

.kpi-icon--score {
  background: #fffbeb;
  color: #d97706;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.kpi-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.kpi-arrow {
  margin-left: auto;
  color: var(--color-text-muted);
  font-size: 14px;
}

.kpi-card--link:hover .kpi-arrow {
  color: var(--color-brand);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.card--full {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.card-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.card-body {
  padding: 20px;
}

.card-body--flush {
  padding: 0;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-brand);
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.attention-count {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-chip--running {
  background: #ebf5ff;
  color: #0077e6;
}

.status-chip--online {
  background: #ecfdf5;
  color: #20501e;
}

.status-chip--online .pi-circle-fill {
  font-size: 8px;
}

.status-chip--offline {
  background: #fef2f2;
  color: #dc2626;
}

.chart-container {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.chart-legend {
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  color: var(--color-text-muted);
  flex: 1;
}

.legend-value {
  font-weight: 600;
  color: var(--color-text);
}

/* Needs Attention */
.attention-list {
  max-height: 320px;
  overflow-y: auto;
}

.attention-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--color-border);
}

.attention-row:last-child {
  border-bottom: none;
}

.attention-title {
  flex: 1;
  font-size: 13px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attention-score {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.attention-score.high {
  background: #ecfdf5;
  color: #166534;
}

.attention-score.mid {
  background: #fffbeb;
  color: #92400e;
}

.attention-score.low {
  background: #fef2f2;
  color: #991b1b;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.empty-state-icon {
  font-size: 28px;
  color: #20501e;
}

/* Status Tags */
.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--pending {
  background: #fffbeb;
  color: #92400e;
}

.status--processing {
  background: #eff6ff;
  color: #1d4ed8;
}

.status--content_ready {
  background: #ebf5ff;
  color: #0077e6;
}

.status--content_error {
  background: #fef2f2;
  color: #dc2626;
}

.status--missing_fields {
  background: #fff7ed;
  color: #b45309;
}

.status--for_review {
  background: #e0f7fa;
  color: #00838f;
}

.status--published {
  background: #ecfdf5;
  color: #20501e;
}

.status--for_publishing {
  background: #f5f3ff;
  color: #6d28d9;
}

.status--failed {
  background: #fef2f2;
  color: #991b1b;
}

.status--error {
  background: #fff7ed;
  color: #c2410c;
}

.status--incorrect_manual {
  background: #f5f3ff;
  color: #6d28d9;
}

.status--manual_does_not_exist {
  background: #f1f5f9;
  color: #475569;
}

/* Mini Table (Recent Activity) */
.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.mini-table thead tr {
  background: var(--color-bg-section);
}

.mini-table th {
  padding: 10px 20px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.mini-table td {
  padding: 10px 20px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.mini-table tbody tr:hover {
  background: var(--color-highlight);
}

.mini-table tbody tr:last-child td {
  border-bottom: none;
}

.mini-title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-title {
  color: var(--color-text);
  font-weight: 500;
}

.mini-meta {
  font-size: 11px;
  color: var(--color-text-muted);
}

.mini-muted {
  color: var(--color-text-muted);
}

.score-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.score--high {
  background: #ecfdf5;
  color: #166534;
}

.score--mid {
  background: #fffbeb;
  color: #92400e;
}

.score--low {
  background: #fef2f2;
  color: #991b1b;
}

/* Task List */
.task-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: var(--color-text);
}

.task-name-cell .pi {
  font-size: 16px;
}

.task-name-cell .pi-check-circle {
  color: #20501e;
}

.task-name-cell .pi-spinner {
  color: var(--color-brand);
}

.task-name-cell .pi-circle {
  color: var(--color-text-muted);
}

.task-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.task-status--open {
  background: var(--color-bg-section);
  color: var(--color-text-muted);
}

.task-status--in_progress {
  background: #ebf5ff;
  color: var(--color-brand);
}

.task-status--done {
  background: #ecfdf5;
  color: #20501e;
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  background: var(--color-bg-section);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill--open {
  background: var(--color-border);
}

.progress-fill--in_progress {
  background: var(--color-brand);
}

.progress-fill--done {
  background: #20501e;
}

.progress-text {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
}

@media (max-width: 900px) {
  .kpi-row {
    grid-template-columns: 1fr 1fr;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
}
</style>
