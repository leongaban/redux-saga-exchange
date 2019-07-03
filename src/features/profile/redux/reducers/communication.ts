import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  savePersonalInfo: makeCommunicationReducer<NS.ISavePersonalInfo, NS.ISavePersonalInfoSuccess, NS.ISavePersonalInfoFail>(
    'PROFILE:SAVE_PERSONAL_INFO',
    'PROFILE:SAVE_PERSONAL_INFO_SUCCESS',
    'PROFILE:SAVE_PERSONAL_INFO_FAIL',
    initial.communication.savePersonalInfo,
  ),
  uploadDocument: makeCommunicationReducer<NS.IUploadDocument, NS.IUploadDocumentSuccess, NS.IUploadDocumentFail>(
    'PROFILE:UPLOAD_DOCUMENT',
    'PROFILE:UPLOAD_DOCUMENT_SUCCESS',
    'PROFILE:UPLOAD_DOCUMENT_FAIL',
    initial.communication.uploadDocument,
  ),
  removeDocument: makeCommunicationReducer<NS.IRemoveDocument, NS.IRemoveDocumentSuccess, NS.IRemoveDocumentFail>(
    'PROFILE:REMOVE_DOCUMENT',
    'PROFILE:REMOVE_DOCUMENT_SUCCESS',
    'PROFILE:REMOVE_DOCUMENT_FAIL',
    initial.communication.removeDocument,
  ),
  uploadImage: makeCommunicationReducer<NS.IUploadImage, NS.IUploadImageSuccess, NS.IUploadImageFail>(
    'PROFILE:UPLOAD_IMAGE',
    'PROFILE:UPLOAD_IMAGE_SUCCESS',
    'PROFILE:UPLOAD_IMAGE_FAIL',
    initial.communication.uploadImage,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
