import { ActionCreator, Dispatch } from 'redux';
import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { IAppReduxState, IDependencies } from 'shared/types/app';

import * as NS from '../../namespace';

const subscriber: SocketSubscriber = new SocketSubscriber();

export function subscribeToEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(data: any) {
      dispatch({ type: 'TRADE_HISTORY:APPLY_DIFF', payload: data });
    }
    subscriber.subscribe(sockets, type, onChange);
    dispatch({ type: 'BALANCE:SUBSCRIBE_TO_EVENTS' });
  };
}

export function unsubscribeFromEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const {sockets} = extra;

    subscriber.unsubscribe(sockets, type);
    dispatch({type: 'BALANCE:UNSUBSCRIBE_FROM_EVENT'});
  };
}

export function reset(): NS.IReset {
  return { type: 'TRADE_HISTORY:RESET' };
}
