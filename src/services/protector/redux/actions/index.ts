import * as NS from '../../namespace';

export * from './communications';
export * from './ui';
export * from './data';
export * from './edit';

export function setCodeFieldValue(payload: string): NS.ISetCodeFieldValue {
  return { type: 'PROTECTOR:SET_CODE_FIELD_VALUE', payload };
}
