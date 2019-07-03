import * as NS from '../../namespace';

export function toggleUserActivityChecking(isChecking: boolean): NS.IToggleUserActivityChecking {
  return { type: 'USER_ACTIVITY_MONITORING:TOGGLE_USER_ACTIVITY_CHECKING', payload: isChecking };
}

export function startUserActivityChecking(): NS.IStartUserActivityChecking {
  return { type: 'USER_ACTIVITY_MONITORING:START_USER_ACTIVITY_CHECKING' };
}

export function setLastServerActivity(payload: number): NS.ISetLastServerActivity {
  return { type: 'USER_ACTIVITY_MONITORING:SET_LAST_SERVER_ACTIVITY', payload };
}
