import * as NS from '../../namespace';

export function reset(): NS.IReset {
  return { type: 'BALANCE:RESET'};
}
