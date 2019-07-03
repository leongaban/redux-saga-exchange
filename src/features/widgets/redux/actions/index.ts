import * as NS from '../../namespace';

export * from './communication';
export * from './edit';
export * from './ui';

export function reset(): NS.IReset {
  return { type: 'WIDGETS:RESET' };
}
