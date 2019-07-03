import { IReduxState, IAppReduxStateEnrich } from '../../namespace';
import { IAppReduxState } from 'shared/types/app';

export const selectAnnoucements = (state: { announcementsAdmin: IReduxState}) => state.announcementsAdmin.data.items;

export const selectWarning = (state: { announcementsAdmin: IReduxState}) => state.announcementsAdmin.data.warning;
export function selectLoading(state: IAppReduxState): boolean {
  return state.announcementsAdmin.communication.loadingAnnouncements.isRequesting;
}
export const selectItems = (state: { announcementsAdmin: IReduxState}) => state.announcementsAdmin.data.items;
export function selectSaving(state: IAppReduxState): boolean {
  return state.announcementsAdmin.communication.savingAnnouncements.isRequesting;
}
export const selectSaveState = (state: { announcementsAdmin: IReduxState}) => state.announcementsAdmin.data.isSaved;

export const selectContent = (state: IAppReduxStateEnrich) =>
  state.form.announcements && state.form.announcements.values && state.form.announcements.values.content;

export const selectModalIndex = (state: IAppReduxStateEnrich) => state.announcementsAdmin.data.modalIndex;
