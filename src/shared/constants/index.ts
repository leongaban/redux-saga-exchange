import { ISortInfo } from '../types/ui';
import { TwoFAType, IExtendedTradeHistoryColumnData, IMConfig, IPaging } from '../types/models';
import { ITableRecordsPerPageSelectConfig } from '../view/components';

export { defaultUserConfig, settingsDefaults, preset as defaultPreset } from './defaultUserConfig';
export { preset as defaultPresetV4 } from './defaultPresetV4';
export * from './widgetsSizes';
export * from './variableWidgetSizes';
export * from './columnsTitles';

export const notDraggableClassName = 'react-grid-layout-not-draggable';

export const fractionalPartLengths = {
  cryptocurrency: 2,
  usdt: 4,
};

export const dateFormat: string = 'YYYY-MM-DDTHH:mm:ss';

export const twoFAProviderName: Record<TwoFAType, string> = {
  sms: 'phone',
  Email: 'email',
  Authenticator: 'authenticator',
};

export const defaultExtendedTradeHistorySortInfo: ISortInfo<IExtendedTradeHistoryColumnData> = {
  column: 'date',
  direction: 'descend',
  kind: 'date',
};

export const stockChartDefaultHistoryDepth = 75;

export const transferIdPrefixes = {
  withdrawal: 'withdrawal',
  lp: 'withdrawal-liquidity-pool',
  fx: 'withdrawal-mt5',
};

export const defaultTableRecordsPerPageSelectOptions = [20, 30, 50, 100];

export const paginatedTableDefaultState = {
  activePage: 1,
  recordsPerPage: defaultTableRecordsPerPageSelectOptions[0],
};

export const defaultRecordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig = {
  initialOption: defaultTableRecordsPerPageSelectOptions[0],
  options: defaultTableRecordsPerPageSelectOptions,
};

export const defaultPaginationState: IPaging = {
  page: 1,
  perPage: defaultTableRecordsPerPageSelectOptions[0],
  total: 1,
};

export const mDefaultConfig: IMConfig = {
  selectedCurrecyPairID: null
};

export enum ACCOUNT {
  INDIVIDUAL = '0',
  BUSINESS = '1'
}

export const sessionExpirationLimit = 60 * 30; // 30min
export const timeBeforeSessionExpirationWarning = 60 * 30; // 30min
export const timeBeforeWeShouldKeepServerAlive = 60 * 15; // 15min

export const defaultDocumentTitle = 'Trade.io';

export const annoucementsDefaultType = 0;
