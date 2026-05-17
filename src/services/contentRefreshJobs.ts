import { httpGet, httpPost, httpPatch, httpPostMultipart } from './httpService';

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
  publishedCount: number;
  unpublishedCount: number;
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
  skipIncorrectManualCheck = false,
): Promise<ManualRecord> {
  const res = await httpPost<ItemResponse>(`${ROOT}/${id}/recreate`, {
    instructions,
    skipIncorrectManualCheck,
  });
  return res.item;
}

export async function republishJob(id: number): Promise<ManualRecord> {
  const res = await httpPost<ItemResponse>(`${ROOT}/${id}/republish`);
  return res.item;
}

export function bulkRedo(
  ids: number[],
  skipIncorrectManualCheck = false,
): Promise<BulkResponse> {
  return httpPost<BulkResponse>(`${ROOT}/bulk-redo`, {
    ids,
    skipIncorrectManualCheck,
  });
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

export async function getJobsByIds(ids: number[]): Promise<ManualRecord[]> {
  if (!ids.length) return [];
  const res = await httpPost<ItemsResponse>(`${ROOT}/by-ids`, { ids });
  return res.items;
}

export interface ManualFileInfo {
  id: string | null;
  name: string | null;
  file: string;
  fileName: string | null;
}

export interface ManualResponse {
  success: true;
  manual: ManualFileInfo | null;
  wpPageId: number;
  message?: string;
}

export async function getCurrentManual(id: number): Promise<ManualResponse> {
  return httpGet<ManualResponse>(`${ROOT}/${id}/manual`);
}

export async function uploadManual(id: number, file: File): Promise<ManualResponse> {
  return httpPostMultipart<ManualResponse>(`${ROOT}/${id}/manual`, { file });
}
