import * as R from 'ramda';

import { IVersionedTypes } from 'shared/types/models/widgets/versioned/v4';
import { getDefaultSizes } from 'shared/helpers/widgets';

import lg from './lg';
import md from './md';
import sm from './sm';
import xs from './xs';
import xxs from './xxs';

const defaultLayouts: IVersionedTypes['IResponsiveLayouts'] = R.map(
  R.map(
    (layout: IVersionedTypes['IRawWidgetLayout']): IVersionedTypes['IWidgetLayout'] =>
      ({ ...getDefaultSizes(layout.kind), ...layout })
  ), { lg, md, sm, xs, xxs });

export default defaultLayouts;
