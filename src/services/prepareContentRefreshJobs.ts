import { httpGet, httpPost } from './httpService';

export interface BrandOption {
  id: number;
  name: string;
  code: string | null;
}

export interface ProductTypeOption {
  id: number;
  name: string;
  code: string | null;
}

export interface LookupsResponse {
  success: true;
  brands: BrandOption[];
  productTypes: ProductTypeOption[];
}

export interface CategoryMatch {
  id: number;
  name: string;
  slug: string;
  count: number | null;
}

export interface ResolveCategoryResponse {
  success: true;
  category: CategoryMatch | null;
  alternatives: CategoryMatch[];
}

export interface PreparePayload {
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  brandId: number;
  productTypeId: number;
  perPage: number;
}

export interface RunRecord {
  id: number;
  categoryId: number;
  categorySlug: string | null;
  categoryName: string | null;
  brandId: number;
  brandName: string | null;
  productTypeId: number;
  productTypeName: string | null;
  perPage: number;
  jobIds: number[];
  jobsCreated: number;
  jobsSkippedExisting: number;
  productsCreated: number;
  pagesFetched: number | null;
  productsFetched: number | null;
  preparedAt: string;
  refreshTriggeredAt: string | null;
  refreshCompletedAt: string | null;
  status: 'prepared' | 'refreshing' | 'completed' | 'failed';
}

export interface RunJob {
  id: number;
  wpPageId: number;
  status: string;
  modelNumber: string | null;
  brand: string | null;
  productType: string | null;
  contentScore: number | null;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  permalink: string | null;
  retryCount: number;
}

export interface RunCounters {
  total: number;
  pending: number;
  processing: number;
  content_ready: number;
  content_error: number;
  published: number;
  failed: number;
  incorrect_manual: number;
  manual_does_not_exist: number;
  missing_fields: number;
  other: number;
  terminal: number;
}

export interface RunStatusResponse {
  success: true;
  run: RunRecord;
  counters: RunCounters;
  jobs: RunJob[];
}

export interface PrepareResponse {
  success: true;
  run: RunRecord;
}

export interface StartRefreshResponse {
  success: true;
  run: RunRecord;
}

export interface RecentRunsResponse {
  success: true;
  runs: RunRecord[];
}

const ROOT = '/prepare-content-refresh-jobs';

export function getLookups(): Promise<LookupsResponse> {
  return httpGet<LookupsResponse>(`${ROOT}/lookups`);
}

export function resolveCategoryBySlug(slug: string): Promise<ResolveCategoryResponse> {
  return httpGet<ResolveCategoryResponse>(`${ROOT}/resolve-category`, { slug });
}

export function preparePrepareRun(payload: PreparePayload): Promise<PrepareResponse> {
  return httpPost<PrepareResponse>(`${ROOT}/prepare`, payload);
}

export function startRefreshForRun(runId: number): Promise<StartRefreshResponse> {
  return httpPost<StartRefreshResponse>(`${ROOT}/runs/${runId}/start-refresh`);
}

export function getRunStatus(runId: number): Promise<RunStatusResponse> {
  return httpGet<RunStatusResponse>(`${ROOT}/runs/${runId}/status`);
}

export function listRecentRuns(limit = 10): Promise<RecentRunsResponse> {
  return httpGet<RecentRunsResponse>(`${ROOT}/runs`, { limit });
}
