import * as NS from '../../namespace';
import { IBalanceDict, IUser } from 'shared/types/models';
import { ActionCreator, Dispatch } from 'redux';
import { IAppReduxState, IDependencies } from 'shared/types/app';
import SocketSubscriber from 'services/sockets/SocketSubscriber';

const subscriber: SocketSubscriber = new SocketSubscriber();

export function login(): NS.ILogin {
  return { type: 'USER:LOGIN' };
}

export function adminLogin(payload: IUser): NS.IAdminLogin {
  return { type: 'USER:ADMIN_LOGIN', payload };
}

export function adminLogout(): NS.IAdminLogout {
  return { type: 'USER:ADMIN_LOGOUT' };
}

export function logout(): NS.ILogout {
  return { type: 'USER:LOGOUT' };
}

export function subscribeToEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;
    function onChange(data: IBalanceDict) {
      dispatch(applyBalanceDiff(data));
    }
    subscriber.subscribe(sockets, type, onChange);
    dispatch({ type: 'USER:SUBSCRIBE_TO_EVENTS' });
  };
}

export function unsubscribeFromEvent(type: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;

    subscriber.unsubscribe(sockets, type);
    dispatch({ type: 'USER:UNSUBSCRIBE_FROM_EVENT' });
  };
}

export function updateData(data: Partial<IUser>) {
  return { type: 'USER:UPDATE_DATA', payload: data };
}

export function applyBalanceDiff(payload: IBalanceDict): NS.IApplyBalanceDiff {
  return { type: 'USER:APPLY_BALANCE_DIFF', payload };
}
