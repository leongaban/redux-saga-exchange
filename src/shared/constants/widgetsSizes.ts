import { WidgetKind, WidgetSizes, IPlaceOrderSettings, IBalanceSettings } from '../types/models';
import { placeOrderWidgetSizes, balanceWidgetHeight } from './variableWidgetSizes';

const balancePreferredHeight = (currencyCodes: string[]) =>
  currencyCodes.length > 2
    ? balanceWidgetHeight.large
    : balanceWidgetHeight.small;

export const widgetsSizes: Record<WidgetKind, WidgetSizes> = {
  'balance': {
    kind: 'dependent-from-settings',
    getDefault: (
      { currencyCodes }: IBalanceSettings,
    ) => ({
      minW: 10,
      minH: balanceWidgetHeight.small,
      w: 24,
      h: balancePreferredHeight(currencyCodes)
    }),
    getUpdate: (
      { currencyCodes }: Partial<IBalanceSettings>,
      { currencyCodes: prevCurrencyCodes }: Partial<IBalanceSettings>,
    ) => {
      if (currencyCodes) {
        if (prevCurrencyCodes && currencyCodes.length === prevCurrencyCodes.length) {
          return null;
        }
        return { h: balancePreferredHeight(currencyCodes) };
      }
      return null;
    },
  },

  'chart': {
    kind: 'plain',
    value: { w: 48, h: 18, minW: 32, minH: 18 },
  },

  'chat': {
    kind: 'plain',
    value: { w: 16, h: 24, minW: 16, minH: 24 },
  },

  'exchange-rates': {
    kind: 'plain',
    value: { w: 24, h: 18, minW: 16, minH: 18 },
  },

  'order-list': {
    kind: 'plain',
    value: { w: 24, h: 12, minW: 16, minH: 12 },
  },

  'order-history': {
    kind: 'plain',
    value: { w: 24, h: 12, minW: 16, minH: 12 },
  },

  'order-book': {
    kind: 'plain',
    value: { w: 24, h: 11, minW: 16, minH: 11 },
  },

  'place-order': {
    kind: 'dependent-from-settings',
    getDefault: ({ sidesDisplayMethod }: IPlaceOrderSettings) => placeOrderWidgetSizes[sidesDisplayMethod],
    getUpdate: ({ sidesDisplayMethod }: Partial<IPlaceOrderSettings>) => sidesDisplayMethod
      ? placeOrderWidgetSizes[sidesDisplayMethod]
      : null,
  },

  'trade-history': {
    kind: 'plain',
    value: { w: 24, h: 12, minW: 16, minH: 12 },
  },

  'operation-history': {
    kind: 'plain',
    value: { w: 24, h: 12, minW: 16, minH: 12 },
  },

  'reporting': {
    kind: 'plain',
    value: { w: 24, h: 12, minW: 16, minH: 12 },
  },

  'announcement-bar': {
    kind: 'plain',
    value: { w: 100, h: 4, minW: 24, minH: 4 },
  }
};
