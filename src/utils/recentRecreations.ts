const STORAGE_KEY = 'recentRecreations';
const RETENTION_MS = 24 * 60 * 60 * 1000;

interface RecentRecreationEntry {
  ids: number[];
  submittedAt: string;
}

function safeRead(): RecentRecreationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RecentRecreationEntry =>
        entry &&
        typeof entry === 'object' &&
        Array.isArray(entry.ids) &&
        entry.ids.every((id) => Number.isInteger(id)) &&
        typeof entry.submittedAt === 'string',
    );
  } catch {
    return [];
  }
}

function safeWrite(entries: RecentRecreationEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable or quota exceeded — proceed without persistence.
  }
}

function pruneStale(entries: RecentRecreationEntry[]): RecentRecreationEntry[] {
  const cutoff = Date.now() - RETENTION_MS;
  return entries.filter((entry) => {
    const t = Date.parse(entry.submittedAt);
    return Number.isFinite(t) && t >= cutoff;
  });
}

export function recordRecreations(ids: number[]): void {
  const normalized = Array.from(
    new Set(ids.filter((id) => Number.isInteger(id) && id > 0)),
  );
  if (normalized.length === 0) return;

  const entries = pruneStale(safeRead());
  entries.push({ ids: normalized, submittedAt: new Date().toISOString() });
  safeWrite(entries);
}

export function getRecentRecreationIds(): Set<number> {
  const entries = pruneStale(safeRead());
  safeWrite(entries);
  const set = new Set<number>();
  for (const entry of entries) {
    for (const id of entry.ids) set.add(id);
  }
  return set;
}

export function clearRecentRecreations(): void {
  safeWrite([]);
}
