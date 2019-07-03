import * as NS from '../../namespace';
import { IAdminPanelUser } from 'shared/types/models';

export function setCurrentUserProfile(payload: Partial<IAdminPanelUser>): NS.ISetCurrentUserProfile {
  return { type: 'USERS:SET_CURRENT_USER_PROFILE', payload };
}

export function setUserProfileModalState(state: boolean): NS.ISetUserProfileModalState {
  return { type: 'USERS:SET_USER_PROFILE_MODAL_STATE', payload: state };
}

export function setUsersTableTotalPages(payload: number): NS.ISetUsersTableTotalPages {
  return { type: 'USERS:SET_USERS_TABLE_TOTAL_PAGES', payload };
}
