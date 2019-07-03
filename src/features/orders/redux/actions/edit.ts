import * as NS from '../../namespace';
import { IActiveOrder, IArchiveOrder } from 'shared/types/models';

export function setCurrentOrder(order: IActiveOrder | IArchiveOrder): NS.ISetCurrentOrder {
  return { type: 'ORDERS:SET_CURRENT_ORDER', payload: order };
}
