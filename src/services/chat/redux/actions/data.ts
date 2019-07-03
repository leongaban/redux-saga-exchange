import { IAppReduxState, IDependencies } from 'shared/types/app';
import { ActionCreator, Dispatch } from 'redux';
import SocketSubscriber from 'services/sockets/SocketSubscriber';

const subscriber: SocketSubscriber = new SocketSubscriber();

export function updateMetaData(eventType: string, actionType: string, data: any): any {
  return { type: 'CHAT:WS_UPDATE', payload: { atype: actionType, data } };
}

export function subscribeToEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(actionType: string, data: any): void {
      dispatch(updateMetaData(type, actionType, data));
    }
    subscriber.subscribe(sockets, type, onChange);
    dispatch({ type: 'CHAT:SUBSCRIBE_TO_EVENT' });
  };
}

export function unsubscribeFromEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;

    subscriber.unsubscribe(sockets, type);
    dispatch({ type: 'CHAT:UNSUBSCRIBE_FROM_EVENT' });
  };
}
