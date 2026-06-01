import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import {
  getRunStatus,
  type RunStatusResponse,
} from '@/services/prepareContentRefreshJobs';

export interface UseRunPollingOptions {
  intervalMs?: number;
  maxConsecutiveErrors?: number;
}

export interface UseRunPollingResult {
  data: Ref<RunStatusResponse | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  lastPolledAt: Ref<Date | null>;
  consecutiveErrors: Ref<number>;
  start: (runId: number) => void;
  stop: () => void;
  pollNow: () => Promise<void>;
}

export function useRunPolling(options: UseRunPollingOptions = {}): UseRunPollingResult {
  const intervalMs = options.intervalMs ?? 5000;
  const maxConsecutiveErrors = options.maxConsecutiveErrors ?? 3;

  const currentRunId = ref<number | null>(null);
  const data = ref<RunStatusResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastPolledAt = ref<Date | null>(null);
  const consecutiveErrors = ref(0);

  let timer: ReturnType<typeof setInterval> | null = null;
  let mounted = false;

  async function pollNow(): Promise<void> {
    if (currentRunId.value === null) return;
    if (loading.value) return;
    loading.value = true;
    try {
      const result = await getRunStatus(currentRunId.value);
      data.value = result;
      lastPolledAt.value = new Date();
      consecutiveErrors.value = 0;
      error.value = null;
      if (result.run.status === 'completed' || result.run.status === 'failed') {
        stop();
      }
    } catch (e) {
      consecutiveErrors.value += 1;
      error.value = e instanceof Error ? e.message : String(e);
      if (consecutiveErrors.value >= maxConsecutiveErrors) {
        stop();
      }
    } finally {
      loading.value = false;
    }
  }

  function start(runId: number): void {
    currentRunId.value = runId;
    consecutiveErrors.value = 0;
    error.value = null;
    if (timer) clearInterval(timer);
    void pollNow();
    timer = setInterval(() => {
      if (!mounted) return;
      if (document.visibilityState === 'hidden') return;
      void pollNow();
    }, intervalMs);
  }

  function stop(): void {
    if (timer) clearInterval(timer);
    timer = null;
  }

  onMounted(() => {
    mounted = true;
  });

  onBeforeUnmount(() => {
    mounted = false;
    stop();
  });

  return {
    data,
    loading,
    error,
    lastPolledAt,
    consecutiveErrors,
    start,
    stop,
    pollNow,
  };
}
