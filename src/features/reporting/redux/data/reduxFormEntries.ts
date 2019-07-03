import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IReportingFormSettings } from 'shared/types/models';

export const reportingSettingsFormEntry =
  makeReduxFormEntry<IReportingFormSettings>('reportingSettingsForm', {
    orderList: {
      datePlaced: null,
      filledPercent: null,
      filledVolume: null,
      fullVolume: null,
      limitPrice: null,
      market: null,
      orderType: null,
      remainingPercent: null,
      remainingVolume: null,
      shouldOpenCancelOrderModal: null,
      type: null,
    },
    orderHistory: {
      datePlaced: null,
      fee: null,
      filledPercent: null,
      filledVolume: null,
      fullVolume: null,
      limitPrice: null,
      market: null,
      orderType: null,
      remainingPercent: null,
      remainingVolume: null,
      status: null,
      total: null,
      type: null,
    },
  });
