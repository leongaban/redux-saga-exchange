import { IAction, IPlainAction, IPlainFailAction, ICommunication } from 'shared/types/redux';
import { IAppReduxState } from 'shared/types/app';
import { IAnnouncement } from 'shared/types/models';

export interface IReduxState {
  data: {
    items: IAnnouncement[],
    warning: boolean,
    isSaved: boolean,
    modalIndex: number | null
  };
  communication: {
    loadingAnnouncements: ICommunication,
    savingAnnouncements: ICommunication,
  };
}

export interface IAppReduxStateEnrich extends IAppReduxState {
  form: {
    announcements: {
      values: {
        content: string;
      };
    }
  };
}

export type ISave = IPlainAction<'ANNOUNCEMENT_ADMIN:SAVE'>;
export type ISaveSuccess = IAction<'ANNOUNCEMENT_ADMIN:SAVE_SUCCESS', {
  saved: boolean
}>;
export type ISaveFail = IPlainFailAction<'ANNOUNCEMENT_ADMIN:SAVE_FAIL'>;

export type IAdd = IAction<'ANNOUNCEMENT_ADMIN:ADD', string>;
export type IEdit = IAction<'ANNOUNCEMENT_ADMIN:EDIT', {
  index: number, content: string
}>;
export type IReorder = IAction<'ANNOUNCEMENT_ADMIN:REORDER', {
  oldIndex: number, newIndex: number
}>;

export type IDelete = IAction<'ANNOUNCEMENT_ADMIN:DELETE', number>;
export type ILoad = IPlainAction<'ANNOUNCEMENT_ADMIN:LOAD'>;
export type ILoadSuccess = IAction<'ANNOUNCEMENT_ADMIN:LOAD_SUCCESS', IAnnouncement[]>;
export type ILoadFail = IPlainFailAction<'ANNOUNCEMENT_ADMIN:LOAD_FAIL'>;
export type IShowEditModal = IAction<'ANNOUNCEMENT_ADMIN:SHOW_EDIT_MODAL', number | null>;

export type Action =
  ISave | ISaveSuccess |
  ISaveFail | IAdd | IEdit | IReorder | IDelete | ILoad |
  ILoadSuccess | ILoadFail | IShowEditModal;
