import { ActionCreator, Dispatch } from 'redux';

import { IChartItem } from 'shared/types/models';
import { IAppReduxState, IDependencies } from 'shared/types/app';
import SocketSubscriber from 'services/sockets/SocketSubscriber';

import * as NS from '../../namespace';

const tickSubscriber: SocketSubscriber = new SocketSubscriber();

export function setLastPrice(payload: IChartItem | null): NS.ISetLastPrice {
  return { type: 'ORDER_BOOK:SET_LAST_PRICE', payload };
}

export function subscribeToTickEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(data: any): void {
      dispatch(setLastPrice(data));
    }
    tickSubscriber.subscribe(sockets, type, onChange);
  };
}

export function unsubscribeFromTickEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;

    tickSubscriber.unsubscribe(sockets, type);
  };
}
