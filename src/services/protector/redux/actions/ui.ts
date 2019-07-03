import * as NS from '../../namespace';

export function toggleVerificationModalState(): NS.IToggleVerificationModalState {
  return { type: 'PROTECTOR:TOGGLE_VERIFICATION_MODAL_STATE' };
}
