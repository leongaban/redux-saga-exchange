import { IAction } from 'shared/types/redux';
import { IOperation } from 'shared/types/models';

export interface IReduxState {
  data: {
    operations: IOperation[];
  };
}

export interface IFilterForm {
  search: string;
  fromDate: number;
  toDate: number;
}

export type IApplyDiff = IAction<'OPERATION_HISTORY:APPLY_DIFF', IOperation[]>;
export type ISubscribe = IAction<'OPERATION_HISTORY:SUBSCRIBE', string>;
export type IUnsubscribe = IAction<'OPERATION_HISTORY:UNSUBSCRIBE', string>;

export type Action = IApplyDiff;
