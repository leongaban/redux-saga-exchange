import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';
import { Moment } from 'moment';

export interface IReduxState {
  communication: {
    setLastActivity: ICommunication;
  };
  edit: {
    isUserActivityCheckingStart: boolean;
    lastServerActivity: number | null;
  };
  ui: {
    isModalSessionExpirationOpen: boolean;
  };
}
/* tslint:disable:max-line-length */
export type ISetLastServerActivity = IAction<'USER_ACTIVITY_MONITORING:SET_LAST_SERVER_ACTIVITY', number>;
export type ISetLastActivity = IAction<'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY', Moment>;
export type ISetLastActivityCompleted = IPlainAction<'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_COMPLETED'>;
export type ISetLastActivityFailed = IPlainFailAction<'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_FAILED'>;

export type IStartUserActivityChecking = IPlainAction<'USER_ACTIVITY_MONITORING:START_USER_ACTIVITY_CHECKING'>;

export type IToggleUserActivityChecking = IAction<'USER_ACTIVITY_MONITORING:TOGGLE_USER_ACTIVITY_CHECKING', boolean>;
export type IToggleModalSessionExpirationState = IAction<'USER_ACTIVITY_MONITORING:TOGGLE_MODAL_SESSION_EXPIRATION_STATE', boolean>;

export type Action =
  | ISetLastActivity | ISetLastActivityCompleted | ISetLastActivityFailed | ISetLastServerActivity
  | IStartUserActivityChecking | IToggleModalSessionExpirationState | IToggleUserActivityChecking;
