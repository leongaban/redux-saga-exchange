import { getFormValues } from 'redux-form';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';

import * as reduxFormEntires from './reduxFormEntries';
import { IReduxState, ChatStatus, ISearchForm, IMessageForm, IMessagesState } from '../namespace';
import { createSelector } from 'reselect';
import { IRoom, IChatMessage } from '../chatApi/namespace';

const {
  chatFormEntry: { name: chatForm },
  searchFormEntry: { name: searchForm },
} = reduxFormEntires;

export function getFeatureState(state: IAppReduxState): IReduxState {
  return state.chat;
}

export function selectStatus(state: IAppReduxState): ChatStatus {
  return getFeatureState(state).data.status;
}

export function selectUserId(state: IAppReduxState): string | null {
  return getFeatureState(state).data.userId;
}

export function selectError(state: IAppReduxState): string | null {
  return getFeatureState(state).data.error;
}

export function selectIsChatReady(state: IAppReduxState): boolean {
  return getFeatureState(state).data.status === 'online';
}

export function selectMessages(state: IAppReduxState): IMessagesState {
  return getFeatureState(state).data.messages;
}

export const selectMessageById = (roomId: string, messageId: string) => (
  state: IAppReduxState,
): IChatMessage | undefined => getFeatureState(state).data.messages[roomId].find(message => message.id === messageId);

export function selectRooms(state: IAppReduxState): IRoom[] {
  return getFeatureState(state).data.rooms;
}

export function selectCurrentRoomId(state: IAppReduxState): string | null {
  return getFeatureState(state).data.roomId;
}

export function selectRoomByName(name: string) {
  return (state: IAppReduxState): IRoom | null =>
    getFeatureState(state).data.rooms.find(room => room.name === name) || null;
}

export function selectRoomIdByName(name: string) {
  return (state: IAppReduxState): string | null => {
    const room = selectRoomByName(name)(state);
    return room ? room.id : null;
  };
}

export function selectRoomById(roomId: string) {
  return (state: IAppReduxState): IRoom | null =>
    getFeatureState(state).data.rooms.find(room => room.id === roomId) || null;
}

export const selectCurrentRoomMessages = createSelector(
  selectMessages,
  selectCurrentRoomId,
  (roomMessages, roomId) => (roomId !== null ? roomMessages[roomId] || [] : []),
);

export function selectIsCacheValid(state: IAppReduxState): boolean {
  return getFeatureState(state).data.isCacheValid;
}

export function selectFirstIndexOfToday(state: IAppReduxState): number | null {
  return getFeatureState(state).data.firstIndexOfToday;
}

export function selectCurrentMessageId(state: IAppReduxState): string | null {
  return getFeatureState(state).data.currentMessageId;
}

export const selectCurrentMessage = createSelector(
  selectChatFormData,
  selectCurrentMessageId,
  selectCurrentRoomId,
  (formValues, id, roomId) => ({ body: formValues.text, id, roomId }),
);

export function selectChatFormData(state: IAppReduxState): IMessageForm {
  return getFormValues(chatForm)(state) as IMessageForm;
}

export function selectChatFormText(state: IAppReduxState): string {
  return R.pathOr('', ['text'], selectChatFormData(state));
}

export function selectSearchFormData(state: IAppReduxState): ISearchForm {
  return getFormValues(searchForm)(state) as ISearchForm;
}
