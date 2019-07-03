import * as NS from '../../namespace';

export function setTimerValue(timerValue: number): NS.ISetTimerValue {
  return { type: 'AUTH:SET_TIMER_VALUE', payload: timerValue };
}

export function startTimer(limit: number): NS.IStartTimer {
  return { type: 'AUTH:START_TIMER', payload: limit };
}

export function stopTimer(): NS.IStopTimer {
  return { type: 'AUTH:STOP_TIMER' };
}

export function setIsTokenInvalid(state: boolean): NS.ISetIsInvalidToken {
  return { type: 'AUTH:SET_IS_TOKEN_INVALID', payload: state };
}
