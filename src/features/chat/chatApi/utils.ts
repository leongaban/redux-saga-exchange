import { path } from 'ramda';

export const getOrThrow = (obj: {}) => (key: string | string[]): any => {
  const result = path(Array.isArray(key) ? key : [key], obj);
  if (result === undefined) {
    throw new Error(`Key not found: "${key}"`);
  }
  return result;
};

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return hashHex;
}
