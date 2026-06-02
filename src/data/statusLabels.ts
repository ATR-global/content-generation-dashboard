export const allStatuses = [
  'pending',
  'processing',
  'content_ready',
  'content_error',
  'missing_fields',
  'for_review',
  'for_publishing',
  'published',
  'failed',
  'error',
  'incorrect_manual',
  'manual_does_not_exist',
] as const;

export type ManualStatus = (typeof allStatuses)[number];

export const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  content_ready: 'Content Ready',
  content_error: 'Content Error',
  missing_fields: 'Missing Fields',
  for_review: 'For Review',
  for_publishing: 'For Publishing',
  published: 'Published',
  failed: 'Failed',
  error: 'Error',
  incorrect_manual: 'Incorrect Manual',
  manual_does_not_exist: 'Manual Does Not Exist',
};

export const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  content_ready: '#0077e6',
  content_error: '#ef4444',
  missing_fields: '#d97706',
  for_review: '#00c7e6',
  for_publishing: '#a78bfa',
  published: '#20501e',
  failed: '#dc2626',
  error: '#f97316',
  incorrect_manual: '#8b5cf6',
  manual_does_not_exist: '#64748b',
};
