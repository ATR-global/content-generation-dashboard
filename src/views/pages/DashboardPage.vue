<template>
  <div class="dashboard-layout">
    <AppHeader />
    <main class="dashboard-main">
      <div class="dashboard-content">
        <h1 class="page-title">Dashboard</h1>

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
                <span class="legend-dot" :style="{ background: refreshChartColors[i] }"></span>
                <span class="legend-label">{{ label }}</span>
                <span class="legend-value">{{ refreshChartData.values[i] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import AppHeader from '@/components/common/AppHeader.vue';
import { pieChartData } from '@/data/sampleData';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const chartData = pieChartData;
const totalManuals = chartData.values.reduce((a, b) => a + b, 0);

const chartColors = [
  '#f59e0b', // Pending - amber
  '#3b82f6', // Processing - blue
  '#0077e6', // Content Ready - brand blue
  '#ef4444', // Content Error - red
  '#20501e', // Done - success green
  '#dc2626', // Failed - dark red
  '#f97316', // Error - orange
  '#8b5cf6', // Incorrect Manual - purple
];

const refreshChartData = {
  labels: [
    'Pending',
    'Processing',
    'Content Ready',
    'Content Error',
    'For Review',
    'Done',
    'Failed',
    'Error',
    'Incorrect Manual',
  ],
  values: [145, 38, 184, 53, 200, 612, 24, 15, 68],
};

const refreshChartColors = [
  '#f59e0b', // Pending - amber
  '#3b82f6', // Processing - blue
  '#0077e6', // Content Ready - brand blue
  '#ef4444', // Content Error - red
  '#00c7e6', // For Review - secondary teal
  '#20501e', // Done - success green
  '#dc2626', // Failed - dark red
  '#f97316', // Error - orange
  '#8b5cf6', // Incorrect Manual - purple
];

const totalRefresh = refreshChartData.values.reduce((a, b) => a + b, 0);

// const pieChartCanvas = ref<HTMLCanvasElement | null>(null);
const refreshChartCanvas = ref<HTMLCanvasElement | null>(null);

function createDoughnut(
  canvas: HTMLCanvasElement,
  labels: string[],
  values: number[],
  colors: string[],
  total: number,
) {
  new Chart(canvas, {
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
              const pct = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

onMounted(() => {
  // if (pieChartCanvas.value) {
  //   createDoughnut(pieChartCanvas.value, chartData.labels, chartData.values, chartColors, totalManuals);
  // }
  if (refreshChartCanvas.value) {
    createDoughnut(refreshChartCanvas.value, refreshChartData.labels, refreshChartData.values, refreshChartColors, totalRefresh);
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

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
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

.card-body {
  padding: 20px;
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

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-bg);
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-value--success {
  color: var(--color-success);
}

.stat-value--brand {
  color: var(--color-brand);
}

.stat-value--warning {
  color: var(--color-warning);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
