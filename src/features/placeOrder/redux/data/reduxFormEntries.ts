import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IPlaceOrderFormData, IPlaceOrderSettings } from 'shared/types/models';

const placeOrderFields: Array<keyof IPlaceOrderFormData> = ['volume', 'price'];

export const placeOrderFormEntry = makeReduxFormEntry<IPlaceOrderFormData>('placeOrderForm', placeOrderFields);

export const placeBuyOrderFormEntry
  = makeReduxFormEntry<IPlaceOrderFormData, 'placeBuyOrderForm'>('placeBuyOrderForm', placeOrderFields,
  );

export const placeSellOrderFormEntry =
  makeReduxFormEntry<IPlaceOrderFormData, 'placeSellOrderForm'>('placeSellOrderForm', placeOrderFields,
  );

export const placeBuyOrderModalFormEntry
  = makeReduxFormEntry<IPlaceOrderFormData, 'placeBuyOrderModalForm'>('placeBuyOrderModalForm', placeOrderFields,
  );

export const placeSellOrderModalFormEntry
  = makeReduxFormEntry<IPlaceOrderFormData, 'placeSellOrderModalForm'>('placeSellOrderModalForm', placeOrderFields,
  );

export const placeOrderSettingsFormEntry
  = makeReduxFormEntry<IPlaceOrderSettings>('placeSellSettingsForm', ['sidesDisplayMethod']);

export type PlaceOrderFormEntry = typeof placeBuyOrderFormEntry | typeof placeSellOrderFormEntry
  | typeof placeBuyOrderModalFormEntry | typeof placeSellOrderModalFormEntry;
