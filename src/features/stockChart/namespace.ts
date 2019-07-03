import { IAction, IPlainAction } from 'shared/types/redux';
import { IChartItem, IDepthHistory } from 'shared/types/models';
import { IClosable } from 'shared/types/ui';

export interface IReduxState {
  data: {
    history: IChartItem[];
    depthHistory: IDepthHistory;
    currentCandle: IChartItem;
    error?: string;
  };
  ui: {
    modals: {
      indicatorsDialog: IClosable;
    }
  };
}

export interface ISetModalDisplayStatusPayload {
  name: keyof IReduxState['ui']['modals'];
  status: boolean;
}

export interface IBlockSettings {
  text: string;
  style: any;
}

export type ISetModalDisplayStatus = IAction<'CHART:SET_MODAL_DISPLAY_STATUS', ISetModalDisplayStatusPayload>;
export type IWebSocketUpdate = IAction<'CHART:WS_UPDATE', any>;

export type IExecuteCommand = IAction<'CHART:EXECUTE_COMMAND', any[]>;

export type IReset = IPlainAction<'CHART:RESET'>;

export type Action =
  | IWebSocketUpdate
  | IReset
  | ISetModalDisplayStatus
  | IExecuteCommand;
