import * as NS from '../../namespace';
import { initial } from '../initial';

export default function uiReducer(
  state: NS.IReduxState['ui'] = initial.ui,
  action: NS.Action,
): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'ASSETS:SET_EDIT_ASSET_MODAL_STATE':
      return {
        isEditAssetModalShown: action.payload,
      };
    default:
      return state;
  }
}
