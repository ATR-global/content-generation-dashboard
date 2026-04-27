import { ref } from 'vue';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastOptions {
  severity?: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}

export interface ToastEntry extends Required<Pick<ToastOptions, 'severity' | 'summary'>> {
  id: number;
  detail: string;
  life: number;
}

const toasts = ref<ToastEntry[]>([]);
let nextId = 1;

function add(options: ToastOptions): number {
  const id = nextId++;
  const entry: ToastEntry = {
    id,
    severity: options.severity ?? 'info',
    summary: options.summary,
    detail: options.detail ?? '',
    life: options.life ?? 3500,
  };
  toasts.value = [...toasts.value, entry];
  if (entry.life > 0) {
    setTimeout(() => remove(id), entry.life);
  }
  return id;
}

function remove(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export function useToast() {
  return { toasts, add, remove };
}
