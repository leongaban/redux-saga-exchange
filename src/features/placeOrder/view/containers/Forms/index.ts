import formFactory from './FormFactory/FormFactory';
import { reduxFormEntries } from '../../../redux';

export function makePlaceSellOrderForm(
  formEntry: typeof reduxFormEntries.placeSellOrderFormEntry
    | typeof reduxFormEntries.placeSellOrderModalFormEntry,
) {
  return formFactory({
    actionTextI18nKey: 'ORDERS:PLACE-ORDER-FORM:SELL-ACTION-TEXT',
    buttonColor: 'red',
    buttonLabelI18nKey: 'ORDERS:PLACE-ORDER-FORM:SELL-BUTTON-LABEL',
    formType: 'sell',
    formEntry,
  });
}

export function makePlaceBuyOrderForm(
  formEntry: typeof reduxFormEntries.placeBuyOrderFormEntry
    | typeof reduxFormEntries.placeBuyOrderModalFormEntry,
) {
  return formFactory({
    actionTextI18nKey: 'ORDERS:PLACE-ORDER-FORM:BUY-ACTION-TEXT',
    buttonColor: 'green',
    buttonLabelI18nKey: 'ORDERS:PLACE-ORDER-FORM:BUY-BUTTON-LABEL',
    formType: 'buy',
    formEntry,
  });
}
