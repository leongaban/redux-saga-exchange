import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IOrderBookFormSettings } from 'shared/types/models/widgets';

export const orderBookSettingsFormEntry = makeReduxFormEntry<IOrderBookFormSettings>(
  'orderBookSettings', ['shouldOpenModalOnPlaceOrderRequest', 'depthView'],
);
