export function formatIsoDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toISOString();
}
