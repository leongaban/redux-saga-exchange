import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';
/* tslint:disable:max-line-length */
export const { execute: setLastActivity, completed: setLastActivityCompleted, failed: setLastActivityFailed } =
  makeCommunicationActionCreators<NS.ISetLastActivity, NS.ISetLastActivityCompleted, NS.ISetLastActivityFailed>(
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY',
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_COMPLETED',
    'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY_FAILED',
  );
