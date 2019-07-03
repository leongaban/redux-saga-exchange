
import { IAction, IPlainAction, IPlainFailAction, ICommunication } from 'shared/types/redux';
import { IAnnouncement } from 'shared/types/models';

export interface IReduxState {
  data: {
    items: IAnnouncement[],
  };
  communication: {
    loadingAnnouncements: ICommunication,
  };
}

export type ILoad = IPlainAction<'ANNOUNCEMENT:LOAD'>;
export type ILoadSuccess = IAction<'ANNOUNCEMENT:LOAD_SUCCESS', IAnnouncement[]>;
export type ILoadFail = IPlainFailAction<'ANNOUNCEMENT:LOAD_FAIL'>;

export type Action =
  | ILoad | ILoadSuccess | ILoadFail ;
