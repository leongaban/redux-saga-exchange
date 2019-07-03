import * as NS from '../../namespace';
import { ISetBalanceModalPropsPayload } from 'shared/types/models';

export function setModalProps<T extends keyof NS.IReduxState['ui']['modals']>(
  payload: ISetBalanceModalPropsPayload<T>,
): NS.ISetModalProps<T> {
  return { type: 'BALANCE:SET_MODAL_PROPS', payload };
}
