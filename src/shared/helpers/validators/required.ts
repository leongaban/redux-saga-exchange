export function required(value: string | undefined): string | undefined {
  return (typeof value !== 'undefined') && String(value).trim() ? undefined : 'Field is required';
}
