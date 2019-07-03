import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IStockChartSettings } from 'shared/types/models';

export const stockChartSettingsFormEntry = makeReduxFormEntry<IStockChartSettings>(
  'stockChartSettings', ['isZoomEnabled', 'candlesticksChartKind'],
);
