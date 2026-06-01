<template>
  <div class="page-layout">
    <AppHeader />
    <main class="page-main">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Prepare Content Refresh Jobs</h1>
            <p class="page-subtitle">
              Prepare new <code>pages_content_refresh_jobs</code> for a Woo category, then start a refresh
              scoped strictly to the just-created jobs.
            </p>
          </div>
          <button v-if="canStartFresh" type="button" class="btn-ghost" @click="onStartNew">
            <i class="pi pi-plus"></i>
            Start new run
          </button>
        </div>

        <div v-if="loadingLookups" class="empty-state">
          <i class="pi pi-spin pi-spinner"></i>
          Loading brands and product types…
        </div>

        <template v-else>
          <PrepareSetupCard
            v-if="!activeRun || activeRun.status === 'completed' || activeRun.status === 'failed' || allowNewWhileActive"
            :brands="brands"
            :product-types="productTypes"
            :locked="false"
            @prepared="onPrepared"
          />

          <template v-if="activeRun">
            <RunSummaryCard
              :run="activeRun"
              :counters="counters"
              :starting="startingRefresh"
              :last-polled-at="polling.lastPolledAt.value"
              :now="now"
              @start-refresh="onStartRefresh"
              @close-run="onCloseRun"
              @poll-now="polling.pollNow"
            />
            <RunJobsTable :jobs="jobs" />
          </template>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import PrepareSetupCard from '@/components/prepare-content/PrepareSetupCard.vue';
import RunSummaryCard from '@/components/prepare-content/RunSummaryCard.vue';
import RunJobsTable from '@/components/prepare-content/RunJobsTable.vue';
import {
  getLookups,
  getRunStatus,
  startRefreshForRun,
  type BrandOption,
  type ProductTypeOption,
  type RunRecord,
  type RunCounters,
  type RunJob,
} from '@/services/prepareContentRefreshJobs';
import { useRunPolling } from '@/composables/useRunPolling';
import { useToast } from '@/composables/useToast';

const LOCAL_STORAGE_KEY = 'prepareContentRefreshJobs.lastRunId';
const EMPTY_COUNTERS: RunCounters = {
  total: 0,
  pending: 0,
  processing: 0,
  content_ready: 0,
  content_error: 0,
  published: 0,
  failed: 0,
  incorrect_manual: 0,
  missing_fields: 0,
  other: 0,
  terminal: 0,
};

const { add: toast } = useToast();

const brands = ref<BrandOption[]>([]);
const productTypes = ref<ProductTypeOption[]>([]);
const loadingLookups = ref(true);

const activeRun = ref<RunRecord | null>(null);
const counters = ref<RunCounters>({ ...EMPTY_COUNTERS });
const jobs = ref<RunJob[]>([]);
const startingRefresh = ref(false);
const allowNewWhileActive = ref(false);

const polling = useRunPolling({ intervalMs: 5000 });

watch(polling.data, (next) => {
  if (!next) return;
  activeRun.value = next.run;
  counters.value = next.counters;
  jobs.value = next.jobs;
});

const now = ref<number>(Date.now());
let nowTimer: ReturnType<typeof setInterval> | null = null;

const canStartFresh = computed(
  () => !!activeRun.value && (activeRun.value.status === 'completed' || activeRun.value.status === 'failed'),
);

onMounted(async () => {
  nowTimer = setInterval(() => { now.value = Date.now(); }, 1000);
  try {
    const lookups = await getLookups();
    brands.value = lookups.brands;
    productTypes.value = lookups.productTypes;
  } catch (e) {
    toast({ severity: 'error', summary: 'Failed to load lookups', detail: e instanceof Error ? e.message : String(e) });
  } finally {
    loadingLookups.value = false;
  }

  const storedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
  const storedId = storedRaw ? Number(storedRaw) : NaN;
  if (Number.isInteger(storedId) && storedId > 0) {
    await hydrateRun(storedId);
  }
});

onBeforeUnmount(() => {
  if (nowTimer) clearInterval(nowTimer);
  polling.stop();
});

async function hydrateRun(runId: number) {
  try {
    const res = await getRunStatus(runId);
    activeRun.value = res.run;
    counters.value = res.counters;
    jobs.value = res.jobs;
    if (res.run.status === 'refreshing') {
      polling.start(runId);
    }
  } catch (e) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    activeRun.value = null;
    counters.value = { ...EMPTY_COUNTERS };
    jobs.value = [];
    console.warn('[PrepareContentRefreshJobs] Failed to hydrate run', e);
  }
}

function onPrepared(run: RunRecord) {
  activeRun.value = run;
  counters.value = { ...EMPTY_COUNTERS, total: run.jobIds.length, pending: run.jobIds.length };
  jobs.value = [];
  allowNewWhileActive.value = false;
  localStorage.setItem(LOCAL_STORAGE_KEY, String(run.id));
  void hydrateRun(run.id);
}

async function onStartRefresh() {
  if (!activeRun.value || startingRefresh.value) return;
  startingRefresh.value = true;
  try {
    const res = await startRefreshForRun(activeRun.value.id);
    activeRun.value = res.run;
    polling.start(res.run.id);
    toast({ severity: 'success', summary: 'Refresh started', detail: `${res.run.jobIds.length} jobs queued` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/already running/i.test(msg)) {
      toast({
        severity: 'warn',
        summary: 'Refresh already running',
        detail: 'Try again when the current run finishes. Your jobs stay queued.',
        life: 7000,
      });
    } else {
      toast({ severity: 'error', summary: 'Start refresh failed', detail: msg, life: 7000 });
    }
  } finally {
    startingRefresh.value = false;
  }
}

function onCloseRun() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  activeRun.value = null;
  counters.value = { ...EMPTY_COUNTERS };
  jobs.value = [];
  polling.stop();
  allowNewWhileActive.value = false;
}

function onStartNew() {
  allowNewWhileActive.value = true;
}
</script>

<style scoped>
.page-layout { min-height: 100vh; background: var(--color-bg); }
.page-main { max-width: 1400px; margin: 0 auto; padding: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-primary); margin: 0 0 4px 0; }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); margin: 0; }
.page-subtitle code { background: var(--color-bg); padding: 1px 6px; border-radius: 4px; font-size: 12px; }
.empty-state {
  padding: 48px 16px; text-align: center; color: var(--color-text-muted);
  display: inline-flex; align-items: center; gap: 10px; width: 100%; justify-content: center;
}
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-white);
  color: var(--color-text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
}
.btn-ghost:hover { color: var(--color-brand); border-color: var(--color-brand); }
</style>
