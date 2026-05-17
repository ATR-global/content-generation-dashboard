<template>
  <div class="row">
    <div class="row-left">
      <div class="row-id-block">
        <span class="row-id">#{{ record.id }}</span>
        <span v-if="isYours" class="row-yours-badge" v-tippy="'You requested this recreation'">
          Yours
        </span>
      </div>
      <div class="row-title-block">
        <div class="row-title-row">
          <span class="row-title" :title="record.title">{{ displayTitle }}</span>
          <span
            v-if="record.errorMessage"
            class="row-error-badge"
            v-tippy="record.errorMessage"
          >
            <i class="pi pi-exclamation-triangle"></i>
          </span>
        </div>
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

    <div class="row-stepper">
      <div
        v-for="step in steps"
        :key="step.key"
        class="step"
        :class="stepClass(step.key)"
      >
        <span class="step-dot">
          <i v-if="stepClass(step.key) === 'step--active'" class="pi pi-spin pi-spinner"></i>
          <i v-else-if="stepClass(step.key) === 'step--done'" class="pi pi-check"></i>
        </span>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <div class="row-right">
      <span v-if="record.status === 'pending'" class="row-status-text row-status-text--pending">
        Queued
      </span>
      <div v-if="hasFooterDetails" class="row-footer">
        <span v-if="retryCount > 0" class="row-retry" v-tippy="'Number of times this job has been retried'">
          <i class="pi pi-history"></i>
          {{ retryCount }} {{ retryCount === 1 ? 'retry' : 'retries' }}
        </span>
        <span v-if="record.contentIssuesRecommendations" class="row-prior-issues" v-tippy="record.contentIssuesRecommendations">
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

interface Props {
  record: ManualRecord;
  isYours: boolean;
}

const props = defineProps<Props>();

const steps = [
  { key: 'pending', label: 'Queued' },
  { key: 'processing', label: 'Processing' },
  { key: 'content_ready', label: 'Finalizing' },
  { key: 'published', label: 'Published' },
] as const;

type StepKey = (typeof steps)[number]['key'];

const STATUS_TO_STEP_INDEX: Record<string, number> = {
  pending: 0,
  processing: 1,
  content_ready: 2,
  // terminal statuses won't normally appear in this list, but we map them in case of stale data
  for_review: 3,
  for_publishing: 3,
  published: 3,
};

const currentStepIndex = computed(() => {
  const idx = STATUS_TO_STEP_INDEX[props.record.status];
  return typeof idx === 'number' ? idx : 0;
});

function stepClass(key: StepKey): string {
  const idx = steps.findIndex((step) => step.key === key);
  if (idx < currentStepIndex.value) return 'step--done';
  if (idx === currentStepIndex.value) return 'step--active';
  return 'step--pending';
}

const displayTitle = computed(() => {
  const t = (props.record.title || '').trim();
  return t || `Job ${props.record.id}`;
});

const retryCount = computed(() => props.record.retryCount ?? 0);

const hasFooterDetails = computed(
  () => retryCount.value > 0 || Boolean(props.record.contentIssuesRecommendations),
);
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) minmax(280px, 2fr) minmax(160px, 1fr);
  gap: 16px;
  padding: 14px 18px;
  align-items: center;
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

.row-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.row-title-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.row-error-badge {
  display: inline-flex;
  align-items: center;
  color: #dc2626;
  font-size: 14px;
  flex-shrink: 0;
  cursor: help;
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

.row-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  position: relative;
}

.step + .step::before {
  content: '';
  position: absolute;
  top: 9px;
  right: calc(50% + 12px);
  left: calc(-50% + 12px);
  height: 2px;
  background: var(--color-border);
}

.step--done + .step::before,
.step--active + .step::before {
  background: var(--color-brand);
}

.step-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-white);
}

.step--done .step-dot {
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.step--active .step-dot {
  border-color: var(--color-brand);
  color: var(--color-brand);
}

.step-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.step--active .step-label,
.step--done .step-label {
  color: var(--color-primary);
}

.row-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.row-status-text--pending {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
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
