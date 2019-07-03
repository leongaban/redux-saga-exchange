import * as NS from '../../namespace';
import {makeCommunicationActionCreators} from 'shared/helpers/redux';

export const { execute: openChannel, completed: openChannelSuccess, failed: openChannelFailed} =
  makeCommunicationActionCreators<NS.IOpenChannel, NS.IOpenChannelSuccess, NS.IOpenChannelFail>(
    'CHAT:OPEN_CHANNEL',
    'CHAT:OPEN_CHANNEL_SUCCESS',
    'CHAT:OPEN_CHANNEL_FAIL',
  );

export const { execute: closeChannel, completed: closeChannelSuccess, failed: closeChannelFailed} =
  makeCommunicationActionCreators<NS.ICloseChannel, NS.ICloseChannelSuccess, NS.ICloseChannelFail>(
    'CHAT:CLOSE_CHANNEL',
    'CHAT:CLOSE_CHANNEL_SUCCESS',
    'CHAT:CLOSE_CHANNEL_FAIL',
  );
