import { httpGet, httpPost, httpPatch } from './httpService';

export interface ManualRecord {
  id: number;
  wpPageId: number;
  pageUrl: string;
  wpPostUrl: string;
  score: number | null;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  retryCount: number;
  title: string;
  previewThumbnails: string[];
  metaFormat: string;
  metaPages: number;
  metaLanguage: string;
  metaApplianceType: string;
  documentOverview: string;
  quickTroubleshootingGuide: string[];
  technicalSpecs: string[];
  compatibleModels: string[];
  whatThisManualHelpsYouFix: string[];
  whatsInsideThisManual: string[];
  troubleshootingGuideQuestions: string[];
  troubleshootingGuideAnswers: string[];
  contentIssuesRecommendations: string;
}

export type TabType = 'unpublished' | 'for_review' | 'published' | 'failed_score';

export interface ListParams {
  tab?: TabType;
  status?: string;
  q?: string;
  sort?: 'id' | 'score' | 'metaPages';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ListResponse {
  success: true;
  items: ManualRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StatsResponse {
  success: true;
  counts: Record<string, number>;
  totalJobs: number;
  avgScore: number | null;
  forReviewCount: number;
  errorCount: number;
  failedScoreCount: number;
}

export interface ItemResponse {
  success: true;
  item: ManualRecord;
  message?: string;
}

export interface ItemsResponse {
  success: true;
  items: ManualRecord[];
}

export interface BulkResponse {
  success: true;
  updated: number;
  ids: number[];
  message?: string;
}

const ROOT = '/content-refresh-jobs';

export function listJobs(params: ListParams = {}): Promise<ListResponse> {
  return httpGet<ListResponse>(ROOT, {
    tab: params.tab,
    status: params.status,
    q: params.q,
    sort: params.sort,
    order: params.order,
    page: params.page,
    pageSize: params.pageSize,
  });
}

export async function getJob(id: number): Promise<ManualRecord> {
  const res = await httpGet<ItemResponse>(`${ROOT}/${id}`);
  return res.item;
}

export async function updateJob(
  id: number,
  patch: Partial<ManualRecord>,
): Promise<ManualRecord> {
  const res = await httpPatch<ItemResponse>(`${ROOT}/${id}`, patch);
  return res.item;
}

export async function recreateJob(
  id: number,
  instructions: string,
): Promise<ManualRecord> {
  const res = await httpPost<ItemResponse>(`${ROOT}/${id}/recreate`, {
    instructions,
  });
  return res.item;
}

export async function republishJob(id: number): Promise<ManualRecord> {
  const res = await httpPost<ItemResponse>(`${ROOT}/${id}/republish`);
  return res.item;
}

export function bulkRedo(ids: number[]): Promise<BulkResponse> {
  return httpPost<BulkResponse>(`${ROOT}/bulk-redo`, { ids });
}

export function bulkPublish(ids: number[]): Promise<BulkResponse> {
  return httpPost<BulkResponse>(`${ROOT}/bulk-publish`, { ids });
}

export function getStats(): Promise<StatsResponse> {
  return httpGet<StatsResponse>(`${ROOT}/stats`);
}

export async function getRecent(limit = 7): Promise<ManualRecord[]> {
  const res = await httpGet<ItemsResponse>(`${ROOT}/recent`, { limit });
  return res.items;
}

export async function getNeedsAttention(limit = 20): Promise<ManualRecord[]> {
  const res = await httpGet<ItemsResponse>(`${ROOT}/needs-attention`, { limit });
  return res.items;
}

export async function getRunningJobs(): Promise<ManualRecord[]> {
  const res = await httpGet<ItemsResponse>(`${ROOT}/running`);
  return res.items;
}
