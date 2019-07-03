import { SagaIterator, Channel, eventChannel } from 'redux-saga';
import { change } from 'redux-form';
import { call, put, select, takeLatest, all, takeEvery } from 'redux-saga/effects';

import { webchat as webchatConfig } from 'config';

import ChatAPI from '../../chatApi';

import * as NS from '../../namespace';
import * as selectors from '../selectors';
import * as actions from '../actions';
import * as reduxFormEntries from '../reduxFormEntries';
import { IAuthData, IChatMessage, IRoom } from 'features/chat/chatApi/namespace';

const LOCALSTORAGE_CHANNEL_KEY = 'webchat-channel';

const initActionType: NS.IInitChat['type'] = 'CHAT:INIT';
const sendMessageType: NS.ISendMessage['type'] = 'CHAT:SEND_MESSAGE';
const copyToMessageType: NS.ICopyToMessage['type'] = 'CHAT:COPY_TO_MESSAGE';
const loginSuccessActionType: NS.ILoginSuccess['type'] = 'CHAT:LOGIN_SUCCESS';
const fetchRoomsActionType: NS.IFetchRooms['type'] = 'CHAT:FETCH_ROOMS';
const switchRoomActionType: NS.ISwitchRoom['type'] = 'CHAT:SWITCH_ROOM';
const editMessageActionType: NS.IEditMessage['type'] = 'CHAT:EDIT_MESSAGE';

/**
 * Wrapper around RocketChat API
 */
const chatAPI = new ChatAPI({
  loginUrl: webchatConfig.loginServer,
  restApiUrl: webchatConfig.restServer,
  wssApiUrl: webchatConfig.websocketServer,
});

/**
 * redux-saga channel between ChatAPI (EventEmitter) and redux
 */
const chatEventChannel = createChatEventChannel(chatAPI);

function getSaga(): () => SagaIterator {
  return function* saga(): SagaIterator {
    yield all([
      takeEvery(chatEventChannel, handleChannelEvent),
      takeLatest(initActionType, executeInit),
      takeLatest(sendMessageType, executeSendMessage),
      takeLatest(copyToMessageType, executeCopyToMessage),
      takeLatest(editMessageActionType, executeEditMessage),
      takeLatest(loginSuccessActionType, executePostLogin),
      takeLatest(fetchRoomsActionType, executeFetchRooms),
      takeLatest(switchRoomActionType, executeSwitchRoom),
    ]);
  };
}

/**
 * Takes actions emitted by chatEventChannel as events and dispatches them
 * @param event event emitted by chatEventChannel
 */
function* handleChannelEvent(event: NS.Action) {
  yield put(event);
}

/**
 * Creates an event channel between chat API and redux-saga
 * @param chat ChatAPI instance to subscribe to
 */
function createChatEventChannel(chat: ChatAPI): Channel<NS.Action> {
  return eventChannel(emit => {
    chat.on('chatError', (error: string) => emit(actions.chatError(error)));

    chat.on('connected', () => emit(actions.chatConnected()));
    chat.on('disconnected', () => emit(actions.chatDisconnected()));

    chat.on('loginSuccess', (data: IAuthData) => emit(actions.loginSuccess(data)));
    chat.on('loginFail', (data: string) => emit(actions.loginFail(data)));

    chat.on('fetchedHistory', (data: NS.IHistory) => emit(actions.historyReceived(data.roomId, data.messages)));

    chat.on('messageReceived', (data: IChatMessage) => emit(actions.messageReceived(data)));
    chat.on('messageDeleted', ({ messageId, roomId }) => emit(actions.messageDeleted(messageId, roomId)));

    const unsubscribe = () => {
      chat.removeAllListeners();
    };

    return unsubscribe;
  });
}

function* getInitialRoomId() {
  let roomId = localStorage.getItem(LOCALSTORAGE_CHANNEL_KEY);
  if (roomId) {
    const roomName = yield select(selectors.selectRoomById(roomId));
    if (!roomName) {
      console.warn(`Saved roomId (${roomId}) is no longer valid. Switching to default.`);
      roomId = '';
    }
  }
  if (!roomId) {
    roomId = yield select(selectors.selectRoomIdByName(webchatConfig.defaultChannel));
    if (!roomId) {
      throw new Error('No default room set OR default room is not present on the RC server.');
    }
  }
  return roomId;
}

function* executeFetchRooms() {
  try {
    const rooms: IRoom[] = yield call(chatAPI.getRooms);
    yield put(actions.fetchRoomsSuccess(rooms));
    const currentRoomId = yield select(selectors.selectCurrentRoomId);
    if (!currentRoomId) {
      const roomId = yield getInitialRoomId();
      yield put(actions.switchRoom(roomId));
    }
  } catch (error) {
    yield put(actions.fetchRoomsFail(error));
  }
}

function* executePostLogin() {
  yield put(actions.initChatSuccess());
  yield put(actions.fetchRooms());
}

function* executeInit() {
  try {
    chatAPI.connect();
    const token = yield call(chatAPI.fetchToken);
    chatAPI.resume(token);
  } catch (error) {
    yield put(actions.initChatFail(error.message || error));
  }
}

function* executeSwitchRoom(action: NS.ISwitchRoom) {
  const roomId = action.payload;
  const currentRoomId: string | undefined = yield select(selectors.selectCurrentRoomId);

  localStorage.setItem(LOCALSTORAGE_CHANNEL_KEY, roomId);

  if (currentRoomId === roomId) {
    return;
  }

  yield put(actions.setCurrentRoomId(roomId));

  // NOTE: We may disable this to reduce "user left, user joined" noise.
  if (currentRoomId) {
    chatAPI.leaveRoom(currentRoomId);
  }

  chatAPI.joinRoom(roomId);
  chatAPI.loadHistory(roomId);
}

/**
 * Sends or updates a message, depending on whether or not a message.id is present.
 */
function* executeSendMessage() {
  const { body, id, roomId } = yield select(selectors.selectCurrentMessage);
  if (id) {
    chatAPI.updateMessage(roomId, body, id);
  } else {
    chatAPI.sendMessage(roomId, body);
  }
  yield put(actions.sendMessageSuccess());
}

function* copyToMessage(text: string) {
  const {
    chatFormEntry: { name, fieldNames },
  } = reduxFormEntries;
  yield put(change(name, fieldNames.text, text));
}

function* executeEditMessage({ payload: message }: NS.IEditMessage) {
  yield copyToMessage(message.body);
}

function* executeCopyToMessage({ payload }: NS.ICopyToMessage) {
  yield copyToMessage(payload);
}

export { getSaga };
