import makeCommunicationActionCreators from 'shared/helpers/redux/communication/makeCommunicationActionCreators';
import { ILoad, ILoadFail, ILoadSuccess } from '../../namespace';

export const { execute: loadAnnouncements, completed: loadAnnouncementsSuccess, failed: loadAnnouncementsFail } =
  makeCommunicationActionCreators<ILoad, ILoadSuccess, ILoadFail>(
    'ANNOUNCEMENT:LOAD',
    'ANNOUNCEMENT:LOAD_SUCCESS',
    'ANNOUNCEMENT:LOAD_FAIL',
  );
