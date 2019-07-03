import { SidesDisplayMethod, IWidgetSizes } from '../types/models';

export const balanceWidgetHeight = {
  small: 8,
  large: 13,
};

export const placeOrderWidgetSizes: Record<SidesDisplayMethod, IWidgetSizes> = {
  'both-sides': { w: 48, minW: 34, h: 23, minH: 22 },
  'single-side-with-swtich': { w: 24, minW: 17, h: 25, minH: 25 },
};
