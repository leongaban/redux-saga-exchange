import { takeLatest, put, select, takeEvery, all } from 'redux-saga/effects';
import * as R from 'ramda';
import { stopSubmit } from 'redux-form';
import uuid from 'uuid';
import { delay } from 'redux-saga';

import { defaultPreset, widgetsSizes } from 'shared/constants';
import { IPreset, IResponsiveLayouts, IWidgetLayout, IPresetLayouts } from 'shared/types/models';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import { convertToPresetLayouts } from 'shared/helpers/converters';
import { getDefaultSizes } from 'shared/helpers/widgets';
import { getCommonPresetsFromOldAndAddToNew, getCommonPresetsLayoutsFromOldAndAddToNew } from 'shared/helpers/presets';
import { selectors as configSelectors, actions as configActions } from 'services/config';

import * as NS from '../../namespace';
import * as actions from '../actions';
import * as reduxFormEntries from '../reduxFormEntries';

export function* updateCurrentPresetsLayouts(
  name: string,
  updater: (x: IPresetLayouts) => IPresetLayouts,
) {
  const currentPresetsLayouts: IPresetLayouts[] = yield select(configSelectors.selectCurrentPresetsLayouts);
  const presetIndex = currentPresetsLayouts.findIndex(x => x.name === name);
  if (presetIndex !== -1) {
    const updatedPresets = R.adjust(updater, presetIndex, currentPresetsLayouts);
    yield put(configActions.setCurrentPresetsLayouts(updatedPresets));
  } else {
    console.error('tried to update unexisting preset layouts with name', name, '\npresets:', currentPresetsLayouts);
  }
}

export function* updatePresets(
  name: string,
  updater: (x: IPreset) => IPreset,
) {
  const presets: IPreset[] = yield select(configSelectors.selectPresets);
  const presetIndex = presets.findIndex(x => x.name === name);
  if (presetIndex !== -1) {
    const updatedPresets = R.adjust(updater, presetIndex, presets);
    yield put(configActions.setUserConfig({ presets: updatedPresets }));
  } else {
    console.error('tried to update unexisting saved preset with name', name, '\npresets:', presets);
  }
}

export function* executeRemoveWidgetSaga({ payload }: NS.IRemoveWidget) {
  const { presetName, widgetUID } = payload;

  try {
    const rejectClosed = R.reject((layout: IWidgetLayout) => layout.i === widgetUID);

    const removeWidget = (layouts: IResponsiveLayouts): IResponsiveLayouts => {
      return R.map((x: IWidgetLayout[] | undefined) => x && rejectClosed(x), layouts);
    };

    const updater = (x: IPresetLayouts) => ({ ...x, layouts: removeWidget(x.layouts) });

    yield updateCurrentPresetsLayouts(presetName, updater);
    yield put(actions.removeWidgetCompleted());

  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.removeWidgetFailed(message));
  }
}

export function* executeAddWidgetSaga({ payload }: NS.IAddWidget) {
  const { presetName, kind, settings } = payload;
  try {
    const uid = uuid();

    const layoutsUpdater = (x: IPresetLayouts): IPresetLayouts => {
      return {
        ...x,
        layouts: R.map(
          (y: IWidgetLayout[] | undefined) => y && [
            ...y,
            { ...getDefaultSizes(kind, settings), i: uid, x: 0, y: Infinity, kind },
          ],
          x.layouts,
        ),
      };
    };
    const settingsUpdater = (x: IPreset): IPreset => {
      return {
        ...x,
        settings: {
          ...x.settings,
          [kind]: {
            ...x.settings[kind],
            [uid]: { ...x.settings[kind][uid], ...settings },
          },
        },
      };
    };

    yield updateCurrentPresetsLayouts(presetName, layoutsUpdater);
    yield updatePresets(presetName, settingsUpdater);
    yield put(actions.addWidgetCompleted());

  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.addWidgetFailed(message));
  }
}

export function* executeAddPresetSaga({ payload: { name } }: NS.IAddPreset) {
  const { newPresetFormEntry: formEntry } = reduxFormEntries;

  try {
    const presets: IPreset[] = yield select(configSelectors.selectPresets);
    const activePreset: IPreset | undefined = yield select(configSelectors.selectActivePreset);
    if (activePreset) {
      const prevStateActivePreset = presets.find(preset => preset.name === activePreset.name);
      if (prevStateActivePreset) {
        const newPresets: IPreset[] = R.append({ ...activePreset, name }, presets);
        const newCurrentPresetsLayouts = newPresets.map(convertToPresetLayouts);
        const newPresetsWithOldActivePresetState = getCommonPresetsFromOldAndAddToNew(presets, newPresets);
        yield put(configActions.setCurrentPresetsLayouts(newCurrentPresetsLayouts));

        yield put(configActions.saveUserConfig({
          presets: newPresetsWithOldActivePresetState,
          activePresetName: name,
        }));

        // TODO delay because we need to succedeedByState in react component to close modal
        yield delay(100);
        yield put(actions.addPresetCompleted());
      }
    } else {
      console.error('could not find active preset');
    }
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(stopSubmit(formEntry.name, { [formEntry.fieldNames.name]: message }));
    yield put(actions.addPresetFailed(message));
  }
}

export function* executeSetPresetsSaga({ payload }: NS.ISetPresets) {
  const { managePresetsFormEntry: formEntry } = reduxFormEntries;
  const presets: IPreset[] = yield select(configSelectors.selectPresets);
  const currentPresetsLayouts: IPresetLayouts[] = yield select(configSelectors.selectCurrentPresetsLayouts);
  try {
    // in case if we remove or rename active preset in manage presets dialog
    const oldActivePreset: IPreset | undefined = yield select(configSelectors.selectActivePreset);
    const activePreset = payload.find(cur => !!oldActivePreset && cur.name === oldActivePreset.name);
    const newCurrentPresetsLayouts = getCommonPresetsLayoutsFromOldAndAddToNew(currentPresetsLayouts, payload);
    const newPresets = getCommonPresetsFromOldAndAddToNew(presets, payload);
    yield put(configActions.setCurrentPresetsLayouts(newCurrentPresetsLayouts));

    yield put(configActions.saveUserConfig({
      presets: newPresets,
      activePresetName: !activePreset ? payload[0].name : activePreset.name,
    }));

    yield put(actions.setPresetsCompleted());
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(stopSubmit(formEntry.name, { [formEntry.fieldNames.presets]: message }));
    yield put(actions.setPresetsFailed(message));
  }
}

export function* executeSetWidgetSettingsSaga({ payload }: NS.ISetWidgetSettings) {
  const { kind, settingsUpdate, uid } = payload;
  try {
    const settingsUpdater = (x: IPreset): IPreset => ({
      ...x,
      settings: {
        ...x.settings,
        [kind]: {
          ...x.settings[kind],
          [uid]: R.mergeDeepRight(x.settings[kind][uid], settingsUpdate),
        },
      },
    });

    const activePreset: IPreset | undefined = yield select(configSelectors.selectActivePreset);
    if (activePreset) {
      const widgetSizes = widgetsSizes[kind];

      switch (widgetSizes.kind) {
        case 'plain': {
          yield updatePresets(activePreset.name, settingsUpdater);
          break;
        }

        case 'dependent-from-settings': {
          const sizesUpdate = widgetSizes.getUpdate(settingsUpdate, activePreset.settings[kind][uid]!);
          const adjustWidgetLayout = (x: IWidgetLayout): IWidgetLayout => {
            return { ...x, ...sizesUpdate };
          };

          const adjustPresetLayouts = (x: IWidgetLayout[]): IWidgetLayout[] => {
            const widgetIndex = x.findIndex(y => y.i === uid);
            if (widgetIndex !== -1) {
              return R.adjust(
                adjustWidgetLayout,
                widgetIndex,
                x);
            } else {
              console.warn(`couldn't find widget`, kind, uid);
              return x;
            }
          };

          const layoutsUpdater = (x: IResponsiveLayouts): IResponsiveLayouts => {
            return R.map(adjustPresetLayouts, x);
          };

          const presetUpdater = (x: IPreset): IPreset => ({
            ...x,
            settings: {
              ...x.settings,
              [kind]: {
                ...x.settings[kind],
                [uid]: R.mergeDeepRight(x.settings[kind][uid], settingsUpdate),
              },
            },
            layouts: layoutsUpdater(x.layouts),
          });

          const currentLayoutsUpdater = (x: IPresetLayouts): IPresetLayouts => ({
            ...x,
            layouts: layoutsUpdater(x.layouts),
          });

          yield updateCurrentPresetsLayouts(activePreset.name, currentLayoutsUpdater);
          yield updatePresets(activePreset.name, presetUpdater);
        }
      }
      const presets: IPreset[] = yield select(configSelectors.selectPresets);
      const layouts = presets.find(preset => preset.name === activePreset.name)!.layouts;

      const findWidget = (key: keyof IResponsiveLayouts) => {
        const breakpointLayouts = layouts[key];
        if (breakpointLayouts) {
          const widgetIndex = breakpointLayouts.findIndex(y => y.i === uid);
          if (widgetIndex !== -1) {
            return true;
          }
        }
        return false;
      };

      const arePresetsShouldBeSaved = Object.keys(layouts).some(
        findWidget,
      );

      if (arePresetsShouldBeSaved) {
        // TODO: empty settings because we updated presets by saga before, need just trigger saving
        yield put(configActions.saveUserConfig({}));
      }
      yield put(actions.setWidgetSettingsCompleted());
    } else {
      console.error('could not find active preset');
    }

  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.setWidgetSettingsFailed(message));
  }
}

export function* executeSetActivePresetWhenItDoesNotExist() {
  const presets: IPreset[] = yield select(configSelectors.selectCurrentPresetsLayouts);
  if (presets.length > 0) {
    const presetName = presets[0].name;
    yield put(configActions.saveUserConfig({
      activePresetName: presetName,
    }));
  } else {
    yield put(actions.setPresets([{ ...defaultPreset }]));
  }
}

export function getSaga() {
  return function* saga() {
    const addPresetActionType: NS.IAddPreset['type'] = 'WIDGETS:ADD_PRESET';
    const setPresetsActionType: NS.ISetPresets['type'] = 'WIDGETS:SET_PRESETS';
    const setWidgetSettingsActionType: NS.ISetWidgetSettings['type'] = 'WIDGETS:SET_WIDGET_SETTINGS';
    const addWidgetActionType: NS.IAddWidget['type'] = 'WIDGETS:ADD_WIDGET';
    const removeWidgetActionType: NS.IRemoveWidget['type'] = 'WIDGETS:REMOVE_WIDGET';
    const setActivePresetWhenItDoesNotExistType: NS.ISetActivePresetWhenItDoesNotExist['type'] =
      'WIDGETS:SET_ACTIVE_PRESET_WHEN_IT_DOES_NOT_EXIST';

    yield all([
      takeLatest(addWidgetActionType, executeAddWidgetSaga),
      takeLatest(removeWidgetActionType, executeRemoveWidgetSaga),
      takeLatest(addPresetActionType, executeAddPresetSaga),
      takeLatest(setPresetsActionType, executeSetPresetsSaga),
      takeEvery(setWidgetSettingsActionType, executeSetWidgetSettingsSaga),
      takeLatest(setActivePresetWhenItDoesNotExistType, executeSetActivePresetWhenItDoesNotExist),
    ]);
  };
}
