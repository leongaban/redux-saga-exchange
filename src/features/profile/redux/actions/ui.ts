import * as NS from '../../namespace';

export function setCroppAvatarModalState(active: NS.ICroppAvaratModal): NS.ISetCroppAvatarModalState {
  return { type: 'PROFILE:SET_CROPP_AVATAR_STATE', payload: active };
}
