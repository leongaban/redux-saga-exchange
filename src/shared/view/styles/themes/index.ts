import { UITheme } from 'shared/types/ui';

import { colors as dayColors } from './day/variables';
import { colors as moonColors } from './moon/variables';
import { colors as nightColors } from './night/variables';

export function getColorsFromTheme(uiTheme: UITheme) {
  switch (uiTheme) {
    case 'day':
      return dayColors;
    case 'night':
      return nightColors;
    case 'moon':
      return moonColors;
    default:
      return dayColors;
  }
}

export function getTableRowHoverColor() {
  return 'rgba(142, 185, 185, 0.2)';
}

export function getSelectedTableRowHoverColor() {
  return 'rgba(0, 152, 216, 0.5)';
}
