import { getFormValues } from 'redux-form';
import { createSelector } from 'reselect';
import * as R from 'ramda';
import { Breakpoints } from 'react-grid-layout';

import { IAppReduxState } from 'shared/types/app';
import { IWidgetLayout } from 'shared/types/models';
import { selectors as configSelectors } from 'services/config';

import { managePresetsFormEntry } from './reduxFormEntries';
import * as NS from '../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.widgets;
}

export function selectAddPresetCommunication(state: IAppReduxState) {
  return getFeatureState(state).communication.addPreset;
}

export function selectModals(state: IAppReduxState) {
  return getFeatureState(state).ui.modals;
}

export const selectExistingWidgetLayouts = createSelector(
  configSelectors.selectActivePreset,
  (preset): IWidgetLayout[] | undefined => {
    if (preset) {
      const { layouts } = preset;
      const key = R.head(Object.keys(layouts)) as Breakpoints;
      if (key) {
        return layouts[key];
      }
    }
  },
);

export const selectActiveExchangeRatesWidgetUID = createSelector(
  selectExistingWidgetLayouts,
  (layouts: IWidgetLayout[] | undefined): string | undefined => {
    if (layouts) {
      const exchangeRatesLayout = layouts.find(x => x.kind === 'exchange-rates');
      if (exchangeRatesLayout) {
        return exchangeRatesLayout.i!;
      }
      console.warn('exchange rates widget does not exist in preset');
    }
  },
);

export function selectPresetsFieldValuesLength(state: IAppReduxState): number {
  const presets = getFormValues(managePresetsFormEntry.name)(state) as NS.IManagePresetsFormData;
  return presets ? presets.presets.length : 0;
}
