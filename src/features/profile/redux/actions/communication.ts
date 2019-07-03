import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

export const { execute: savePersonalInfo, completed: savePersonalInfoSuccess, failed: savePersonalInfoFail } =
  makeCommunicationActionCreators<NS.ISavePersonalInfo, NS.ISavePersonalInfoSuccess, NS.ISavePersonalInfoFail>(
    'PROFILE:SAVE_PERSONAL_INFO', 'PROFILE:SAVE_PERSONAL_INFO_SUCCESS', 'PROFILE:SAVE_PERSONAL_INFO_FAIL',
  );

export const { execute: uploadDocument, completed: uploadDocumentSuccess, failed: uploadDocumentFail } =
  makeCommunicationActionCreators<NS.IUploadDocument, NS.IUploadDocumentSuccess, NS.IUploadDocumentFail>(
    'PROFILE:UPLOAD_DOCUMENT', 'PROFILE:UPLOAD_DOCUMENT_SUCCESS', 'PROFILE:UPLOAD_DOCUMENT_FAIL',
  );

export const { execute: removeDocument, completed: removeDocumentSuccess, failed: removeDocumentFail } =
  makeCommunicationActionCreators<NS.IRemoveDocument, NS.IRemoveDocumentSuccess, NS.IRemoveDocumentFail>(
    'PROFILE:REMOVE_DOCUMENT', 'PROFILE:REMOVE_DOCUMENT_SUCCESS', 'PROFILE:REMOVE_DOCUMENT_FAIL',
  );

export const { execute: uploadImage, completed: uploadImageSuccess, failed: uploadImageFail } =
  makeCommunicationActionCreators<NS.IUploadImage, NS.IUploadImageSuccess, NS.IUploadImageFail>(
    'PROFILE:UPLOAD_IMAGE', 'PROFILE:UPLOAD_IMAGE_SUCCESS', 'PROFILE:UPLOAD_IMAGE_FAIL',
  );
