import { IPlainAction, IPlainFailAction, ICommunication, IAction } from 'shared/types/redux';
import { IImageFile, IPersonalDataForm } from 'shared/types/models';

export interface IReduxState {
  communication: {
    savePersonalInfo: ICommunication;
    uploadDocument: ICommunication;
    removeDocument: ICommunication;
    uploadImage: ICommunication;
  };
  edit: {
    uploadProgress: number;
  };
  ui: {
    croppAvatarModalState: ICroppAvaratModal;
  };
}
export interface ICroppAvaratModal {
  isOpen: boolean;
  image?: IImageFile;
}

export interface IRemoveDocumentPayload {
  index: number;
  id: string;
  type: number;
}

export interface IUploadDocumentPayload {
  file: File;
  type: number;
}

export type ISavePersonalInfo = IAction<'PROFILE:SAVE_PERSONAL_INFO', IPersonalDataForm>;
export type ISavePersonalInfoSuccess = IPlainAction<'PROFILE:SAVE_PERSONAL_INFO_SUCCESS'>;
export type ISavePersonalInfoFail = IPlainFailAction<'PROFILE:SAVE_PERSONAL_INFO_FAIL'>;

export type IUploadDocument = IAction<'PROFILE:UPLOAD_DOCUMENT', IUploadDocumentPayload>;
export type IUploadDocumentSuccess = IPlainAction<'PROFILE:UPLOAD_DOCUMENT_SUCCESS'>;
export type IUploadDocumentFail = IPlainFailAction<'PROFILE:UPLOAD_DOCUMENT_FAIL'>;

export type IRemoveDocument = IAction<'PROFILE:REMOVE_DOCUMENT', IRemoveDocumentPayload>;
export type IRemoveDocumentSuccess = IPlainAction<'PROFILE:REMOVE_DOCUMENT_SUCCESS'>;
export type IRemoveDocumentFail = IPlainFailAction<'PROFILE:REMOVE_DOCUMENT_FAIL'>;

export type IUploadImage = IAction<'PROFILE:UPLOAD_IMAGE', IImageFile>;
export type IUploadImageSuccess = IPlainAction<'PROFILE:UPLOAD_IMAGE_SUCCESS'>;
export type IUploadImageFail = IPlainFailAction<'PROFILE:UPLOAD_IMAGE_FAIL'>;

export type ISetUploadProgress = IAction<'PROFILE:SET_UPLOAD_PROGRESS', number>;

export type ISetCroppAvatarModalState = IAction<'PROFILE:SET_CROPP_AVATAR_STATE', ICroppAvaratModal>;

export type Action = ISavePersonalInfo | ISavePersonalInfoSuccess | ISavePersonalInfoFail
  | IUploadDocument | IUploadDocumentSuccess | IUploadDocumentFail
  | IRemoveDocument | IRemoveDocumentSuccess | IRemoveDocumentFail
  | IUploadImage | IUploadImageSuccess | IUploadImageFail
  | ISetCroppAvatarModalState
  | ISetUploadProgress;
