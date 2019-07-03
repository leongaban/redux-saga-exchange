import { WidgetKind, WidgetSettings, IWidgetSizes } from 'shared/types/models';

import { widgetsSizes } from '../constants/widgetsSizes';
import { widgetSettings } from '../constants/defaultUserConfig/preset/settings';

export function getDefaultSizes(x: WidgetKind, settings?: WidgetSettings): IWidgetSizes {
  if (settings !== undefined) {
    const sizes = widgetsSizes[x];

    switch (sizes.kind) {
      case 'plain':
        return sizes.value;
      case 'dependent-from-settings': {
        return sizes.getDefault(settings);
      }
      default: {
        console.error('unexpected sizes kind', sizes);
        return getDefaultSizes(x, widgetSettings[x]);
      }
    }
  } else {
    return getDefaultSizes(x, widgetSettings[x]);
  }
}
