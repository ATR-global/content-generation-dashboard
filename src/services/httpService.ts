const API_BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/content-generation-api`;

type QueryValue = string | number | boolean | undefined | null;

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = `${API_BASE}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function handle<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) {
      onUnauthorized?.();
    }
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore body parse failure
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function httpGet<T>(
  path: string,
  query?: Record<string, QueryValue>,
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    credentials: 'include',
  });
  return handle<T>(response, path);
}

export async function httpPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handle<T>(response, path);
}

export async function httpPatch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handle<T>(response, path);
}
