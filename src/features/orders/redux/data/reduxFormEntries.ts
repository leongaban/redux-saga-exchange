import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IOrderListSettings, IOrderHistorySettings } from 'shared/types/models';

export const orderListSettingsFormEntry = makeReduxFormEntry<IOrderListSettings, 'orderListSettings'>(
  'orderListSettings', [
    'datePlaced', 'market', 'type', 'fullVolume', 'limitPrice',
    'filledVolume', 'filledPercent', 'remainingVolume', 'remainingPercent',
    'orderType', 'shouldOpenCancelOrderModal',
  ]);

export const orderHistorySettingsFormEntry = makeReduxFormEntry<IOrderHistorySettings, 'orderHistorySettings'>(
  'orderHistorySettings', [
    'datePlaced', 'market', 'type', 'fullVolume', 'limitPrice',
    'filledVolume', 'filledPercent', 'remainingVolume', 'remainingPercent',
    'orderType', 'total', 'fee', 'status',
  ]);
