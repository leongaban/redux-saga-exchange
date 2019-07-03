import { ISecretInfo } from 'shared/types/models';
import { ISecretInfoResponse } from '../types/';

export function convertSecretInfoResponse(response: ISecretInfoResponse): ISecretInfo {
  return {
    qrCode: response.otpUrl,
    secretCode: response.secret,
    is2FAEnabled: response.enabled,
  };
}
