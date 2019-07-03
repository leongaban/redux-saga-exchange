import { IAppReduxState, IDependencies } from 'shared/types/app';
import { ActionCreator, Dispatch } from 'redux';
import { IServerCandle } from 'shared/types/models';
import * as NS from '../../namespace';

export function executeCommand(command: string, params: any, instanceKey: string): ActionCreator<void> {
  return (dispatch: Dispatch<IAppReduxState>, _getState: () => IAppReduxState, extra: IDependencies) => {
    const { sockets } = extra;

    return new Promise<IServerCandle[]>((resolve) => {
      sockets.command(command, params, (data: IServerCandle[]) => {
        dispatch({
          type: 'CHART:WS_UPDATE',
          _instanceKey: instanceKey,
          payload: {
            type: command,
            data,
          },
        });
        resolve(data);
      });

      dispatch({ type: 'CHART:EXECUTE_COMMAND', _instanceKey: instanceKey });
    });
  };
}

export function reset(): NS.IReset {
  return { type: 'CHART:RESET' };
}
