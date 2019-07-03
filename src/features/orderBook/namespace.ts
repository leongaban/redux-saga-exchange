import { IAction, IPlainAction } from 'shared/types/redux';
import { IChartItem, ILastPrice } from 'shared/types/models';

export interface IReduxState {
  data: {
    lastPrice: ILastPrice | null;
  };
  edit: {
    // TODO this state presents at settings and should be removed
    decimals: number | null;
  };
}

export type ISetDecimals = IAction<'ORDER_BOOK:SET_DECIMALS', number>;
export type ISetLastPrice = IAction<'ORDER_BOOK:SET_LAST_PRICE', IChartItem | null>;
export type ISetDefaultDocumentTitle = IPlainAction<'ORDER_BOOK:SET_DEFAULT_DOCUMENT_TITLE'>;

export type Action = ISetDecimals | ISetLastPrice;
