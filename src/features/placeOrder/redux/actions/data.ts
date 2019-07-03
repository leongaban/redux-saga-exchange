import { ActionCreator, Dispatch } from 'redux';
import { IAppReduxState, IDependencies } from 'shared/types/app';

import * as NS from '../../namespace';
import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { IChartItem } from 'shared/types/models';

export function setCurrentCandle(payload: IChartItem): NS.ISetCurrentCandle {
  return { type: 'PLACE_ORDER:SET_CURRENT_CANDLE', payload };
}

const tickSubscriber: SocketSubscriber = new SocketSubscriber();

export function subscribeToTickEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(data: IChartItem): void {
      dispatch(setCurrentCandle(data));
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
