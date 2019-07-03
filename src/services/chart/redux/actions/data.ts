import { ActionCreator, Dispatch } from 'redux';
import { IAppReduxState, IDependencies } from 'shared/types/app';
import SocketSubscriber from 'services/sockets/SocketSubscriber';

const subscriber: SocketSubscriber = new SocketSubscriber();

export function updateMetaData(eventType: string, instanceKey: string, data: any): any {
  const wsact = eventType.split('.');
  return {
    type: 'CHART:WS_UPDATE',
    _instanceKey: instanceKey,
    payload: {
      type: wsact[0],
      channel: wsact[1], data,
    },
  };
}

export function openChannel(type: string, onEnter: any, instanceKey: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    subscriber.enterChannel(sockets, type, onEnter);
    dispatch({ type: 'CHART:ENTER_CHANNEL', _instanceKey: instanceKey });
  };
}

export function closeChannel(type: string, instanceKey: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    subscriber.leaveChannel(sockets, type);
    dispatch({ type: 'CHART:LEAVE_CHANNEL', _instanceKey: instanceKey });
  };
}

export function subscribeToEvent(type: string, instanceKey: string, onTick?: (data: any) => void): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(data: any): void {
      dispatch(updateMetaData(type, instanceKey, data));
      onTick && onTick(data);
    }
    subscriber.subscribe(sockets, type, onChange);
    dispatch({ type: 'CHART:SUBSCRIBE_TO_EVENTS', _instanceKey: instanceKey });
  };
}

export function unsubscribeFromEvent(type: string, instanceKey: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;

    subscriber.unsubscribe(sockets, type);
    dispatch({ type: 'CHART:UNSUBSCRIBE_FROM_EVENT', _instanceKey: instanceKey });
  };
}
