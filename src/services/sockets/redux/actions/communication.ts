import { makeCommunicationActionCreators } from 'shared/helpers/redux';

import * as NS from './../../namespace';

export const { execute: openChannel, completed: openChannelCompleted, failed: openChannelFailed } =
  makeCommunicationActionCreators<NS.IOpenChanel, NS.IOpenChanelCompleted, NS.IOpenChanelFailed>(
    'SOCKETS:OPEN_CHANNEL',
    'SOCKETS:OPEN_CHANNEL_COMPLETED',
    'SOCKETS:OPEN_CHANNEL_FAILED',
  );

export const { execute: closeChannel, completed: closeChannelCompleted, failed: closeChannelFailed } =
  makeCommunicationActionCreators<NS.ICloseChanel, NS.ICloseChanelCompleted, NS.ICloseChanelFailed>(
    'SOCKETS:CLOSE_CHANEL',
    'SOCKETS:CLOSE_CHANEL_COMPLETED',
    'SOCKETS:CLOSE_CHANEL_FAILED',
  );
