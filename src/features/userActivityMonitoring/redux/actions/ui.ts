import * as NS from '../../namespace';

export function toggleModalSessionExpirationState(state: boolean): NS.IToggleModalSessionExpirationState {
  return { type: 'USER_ACTIVITY_MONITORING:TOGGLE_MODAL_SESSION_EXPIRATION_STATE', payload: state };
}
