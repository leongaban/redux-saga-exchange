import makeCommunicationActionCreators from 'shared/helpers/redux/communication/makeCommunicationActionCreators';
import * as NS from '../../namespace';

export const { execute: initChat, completed: initChatSuccess, failed: initChatFail } = makeCommunicationActionCreators<
  NS.IInitChat,
  NS.IInitChatSuccess,
  NS.IInitChatFail
>('CHAT:INIT', 'CHAT:INIT_SUCCESS', 'CHAT:INIT_FAIL');

export const { execute: login, completed: loginSuccess, failed: loginFail } = makeCommunicationActionCreators<
  NS.ILogin,
  NS.ILoginSuccess,
  NS.ILoginFail
>('CHAT:LOGIN', 'CHAT:LOGIN_SUCCESS', 'CHAT:LOGIN_FAIL');

export const {
  execute: fetchRooms,
  completed: fetchRoomsSuccess,
  failed: fetchRoomsFail,
} = makeCommunicationActionCreators<NS.IFetchRooms, NS.IFetchRoomsSuccess, NS.IFetchRoomsFail>(
  'CHAT:FETCH_ROOMS',
  'CHAT:FETCH_ROOMS_SUCCESS',
  'CHAT:FETCH_ROOMS_FAIL',
);
