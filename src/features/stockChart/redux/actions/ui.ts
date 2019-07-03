import * as NS from '../../namespace';

export function setModalDisplayStatus(payload: NS.ISetModalDisplayStatusPayload): NS.ISetModalDisplayStatus {
  return { type: 'CHART:SET_MODAL_DISPLAY_STATUS', payload };
}
