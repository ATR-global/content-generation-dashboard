<template>
  <div class="row" :class="{ 'row--failed-score': isFailedScore }">
    <div class="row-left">
      <div class="row-id-block">
        <span class="row-id">#{{ record.id }}</span>
        <span class="row-yours-badge" v-tippy="'You requested this recreation'">
          Yours
        </span>
        <span
          v-if="isFailedScore"
          class="row-failed-badge"
          v-tippy="'Score below 7.8 — recreated content did not meet quality threshold'"
        >
          <i class="pi pi-exclamation-triangle"></i>
          Failed score
        </span>
      </div>
      <div class="row-title-block">
        <span class="row-title" :title="record.title">{{ displayTitle }}</span>
        <a
          v-if="record.pageUrl"
          class="row-page-link"
          :href="record.pageUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="pi pi-external-link"></i>
          Page #{{ record.wpPageId }}
        </a>
        <span v-else class="row-page-link row-page-link--inert">
          Page #{{ record.wpPageId }}
        </span>
      </div>
    </div>

    <div class="row-middle">
      <span class="status-tag" :class="'status--' + record.status">
        {{ statusLabels[record.status] || record.status }}
      </span>
      <span
        v-if="hasScore"
        class="score-badge"
        :class="scoreClass"
        v-tippy="'Content quality score'"
      >
        {{ record.score }}
      </span>
    </div>

    <div class="row-right">
      <span v-if="completedLabel" class="row-completed">
        <i class="pi pi-check-circle"></i>
        Completed {{ completedLabel }}
      </span>
      <span v-else class="row-completed row-completed--muted">
        <i class="pi pi-clock"></i>
        Completion time unavailable
      </span>
      <div v-if="hasFooterDetails" class="row-footer">
        <span v-if="retryCount > 0" class="row-retry" v-tippy="'Number of times this job has been retried'">
          <i class="pi pi-history"></i>
          {{ retryCount }} {{ retryCount === 1 ? 'retry' : 'retries' }}
        </span>
        <span
          v-if="record.contentIssuesRecommendations"
          class="row-prior-issues"
          v-tippy="record.contentIssuesRecommendations"
        >
          <i class="pi pi-info-circle"></i>
          Prior audit feedback applied
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ManualRecord } from '@/services/contentRefreshJobs';
import { statusLabels } from '@/data/statusLabels';

interface Props {
  record: ManualRecord;
  nowMs: number;
}

const FAILED_SCORE_THRESHOLD = 7.8;

const props = defineProps<Props>();

const displayTitle = computed(() => {
  const t = (props.record.title || '').trim();
  return t || `Job ${props.record.id}`;
});

const hasScore = computed(
  () => props.record.score !== null && props.record.score !== undefined,
);

const isFailedScore = computed(
  () => hasScore.value && (props.record.score as number) < FAILED_SCORE_THRESHOLD,
);

const scoreClass = computed(() => {
  const s = props.record.score;
  if (s === null || s === undefined) return 'score--low';
  if (s >= 8.5) return 'score--high';
  if (s >= 7.0) return 'score--mid';
  return 'score--low';
});

const completedLabel = computed(() => {
  const iso = props.record.completedAt;
  if (!iso) return '';
  const completedMs = Date.parse(iso);
  if (!Number.isFinite(completedMs)) return '';
  const ageSec = Math.max(0, Math.floor((props.nowMs - completedMs) / 1000));
  if (ageSec < 60) return 'just now';
  if (ageSec < 3600) {
    const m = Math.floor(ageSec / 60);
    return `${m}m ago`;
  }
  if (ageSec < 86400) {
    const h = Math.floor(ageSec / 3600);
    return `${h}h ago`;
  }
  const d = Math.floor(ageSec / 86400);
  return `${d}d ago`;
});

const retryCount = computed(() => props.record.retryCount ?? 0);

const hasFooterDetails = computed(
  () => retryCount.value > 0 || Boolean(props.record.contentIssuesRecommendations),
);
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) minmax(220px, 1.4fr) minmax(180px, 1fr);
  gap: 16px;
  padding: 14px 18px;
  align-items: center;
}

.row--failed-score {
  background: #fff7f7;
}

.row-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.row-id-block {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.row-id {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.4px;
}

.row-yours-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-accent-light);
  color: var(--color-brand);
  text-transform: uppercase;
}

.row-failed-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fef2f2;
  color: #b91c1c;
  text-transform: uppercase;
}

.row-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.row-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-page-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-brand);
  text-decoration: none;
  width: fit-content;
}

.row-page-link:hover {
  text-decoration: underline;
}

.row-page-link--inert {
  color: var(--color-text-muted);
  pointer-events: none;
}

.row-middle {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status--pending { background: #fffbeb; color: #92400e; }
.status--processing { background: #eff6ff; color: #1d4ed8; }
.status--content_ready { background: #ebf5ff; color: #0077e6; }
.status--content_error { background: #fef2f2; color: #dc2626; }
.status--missing_fields { background: #fff7ed; color: #b45309; }
.status--for_review { background: #e0f7fa; color: #00838f; }
.status--published { background: #ecfdf5; color: #20501e; }
.status--for_publishing { background: #f5f3ff; color: #6d28d9; }
.status--failed { background: #fef2f2; color: #991b1b; }
.status--error { background: #fff7ed; color: #c2410c; }
.status--incorrect_manual { background: #f5f3ff; color: #6d28d9; }

.score-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.score--high { background: #ecfdf5; color: #166534; }
.score--mid { background: #fffbeb; color: #92400e; }
.score--low { background: #fef2f2; color: #991b1b; }

.row-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.row-completed {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
}

.row-completed--muted {
  color: var(--color-text-muted);
  font-weight: 400;
  font-style: italic;
}

.row-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.row-retry,
.row-prior-issues {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
