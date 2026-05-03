export function formatIsoDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toISOString();
}

export function formatElapsed(fromIso: string | null | undefined, nowMs: number = Date.now()): string {
  if (!fromIso) return '—';
  const startMs = Date.parse(fromIso);
  if (!Number.isFinite(startMs)) return '—';
  const diffSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}
