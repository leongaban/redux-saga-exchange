import * as NS from '../../namespace';

export function removeSecretKey(label: string): NS.IRemoveSecretKey {
  return { type: 'API_KEYS:REMOVE_API_KEY_SECRET_KEY', payload: label };
}
