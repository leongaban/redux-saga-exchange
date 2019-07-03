import makeCommunicationActionCreators from 'shared/helpers/redux/communication/makeCommunicationActionCreators';
import * as NS from './../../namespace';

export const { execute: loadAnnouncements, completed: loadAnnouncementsSuccess, failed: loadAnnouncementsFail } =
  makeCommunicationActionCreators<NS.ILoad, NS.ILoadSuccess, NS.ILoadFail>(
    'ANNOUNCEMENT_ADMIN:LOAD',
    'ANNOUNCEMENT_ADMIN:LOAD_SUCCESS',
    'ANNOUNCEMENT_ADMIN:LOAD_FAIL',
  );

export const { execute: saveAnnouncement, completed: saveAnnouncementsSuccess, failed: saveAnnouncementsFail } =
  makeCommunicationActionCreators<NS.ISave, NS.ISaveSuccess, NS.ISaveFail>(
    'ANNOUNCEMENT_ADMIN:SAVE',
    'ANNOUNCEMENT_ADMIN:SAVE_SUCCESS',
    'ANNOUNCEMENT_ADMIN:SAVE_FAIL',
  );
