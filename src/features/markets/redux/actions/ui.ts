import * as NS from '../../namespace';

export function setEditMarketModalState(state: boolean): NS.ISetEditMarketModalState {
  return { type: 'MARKETS:SET_EDIT_MARKET_MODAL_STATE', payload: state };
}
