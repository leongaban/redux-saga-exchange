import * as R from 'ramda';
import { IResponsiveLayouts } from 'shared/types/models';
import { insertSizes } from '../../../helpers';

import lg from './lg';
import md from './md';
import sm from './sm';
import xs from './xs';
import xxs from './xxs';

const defaultLayouts: IResponsiveLayouts = R.map(R.map(insertSizes), { lg, md, sm, xs, xxs });

export default defaultLayouts;
