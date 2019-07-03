import * as NS from '../../namespace';

export function terminateVerification(): NS.ITerminateVerification {
  return { type: 'PROTECTOR:TERMINATE_VERIFICATION' };
}

export function reset(): NS.IReset {
  return { type: 'PROTECTOR:RESET' };
}
