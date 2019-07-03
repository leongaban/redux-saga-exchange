import * as NS from '../../namespace';

export function setEditAssetModalState(payload: boolean): NS.ISetEditAssetModalState {
  return { type: 'ASSETS:SET_EDIT_ASSET_MODAL_STATE', payload };
}
