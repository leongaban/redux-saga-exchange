import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import block from 'bem-cn';

import { featureConnect } from 'core';
import { IMenuEntry, Menu } from 'shared/view/components';
import { Icon } from 'shared/view/elements';
import { IPreset, IPresetLayouts } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { Action } from 'shared/types/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import * as features from 'features';
import { arePresetsLayoutsChanged } from 'shared/helpers/presets';

import './ClassicTradeWidgetOptions.scss';

interface IStateProps {
  presets: IPreset[];
  currentPresetsLayouts: IPresetLayouts[];
  activePreset?: IPreset;
}

interface IActionProps {
  setModalDisplayStatus: Action<features.widgets.namespace.ISetModalDisplayStatus>;
  saveUserConfig: typeof configActions.saveUserConfig;
  saveCurrentPresetsLayouts: typeof configActions.saveCurrentPresetsLayouts;
}

interface IFeatureProps {
  widgetsFeatureEntry: features.widgets.Entry;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IFeatureProps;

function mapState(state: IAppReduxState, featureProps: IFeatureProps): IStateProps {
  return {
    presets: configSelectors.selectPresets(state),
    activePreset: configSelectors.selectActivePreset(state),
    currentPresetsLayouts: configSelectors.selectCurrentPresetsLayouts(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IFeatureProps): IActionProps {
  return bindActionCreators({
    setModalDisplayStatus: featureProps.widgetsFeatureEntry.actions.setModalDisplayStatus,
    saveUserConfig: configActions.saveUserConfig,
    saveCurrentPresetsLayouts: configActions.saveCurrentPresetsLayouts,
  }, dispatch);
}

const b = block('classic-trade-widget-options');

class ClassicTradeWidgetOptions extends React.PureComponent<IProps> {
  public render() {
    const {
      currentPresetsLayouts: presets, activePreset, translate: t,
    } = this.props;
    const menuEntriesSections: IMenuEntry[][] = [
      presets.map(({ name }: IPreset): IMenuEntry => ({
        content: name,
        onClick: this.makePresetMenuEntryHandler(name),
      })),
      [{ content: 'Save', onClick: this.handleSavePresetClick }],
      [{ content: 'Save as...', onClick: this.handleCopyPresetClick }],
      [{ content: 'Manage Presets', onClick: this.handleManagePresetsClick }],
    ];

    return (
      <div className={b()}>
        <div className={b('option')()}>
          <Menu menuPosition="left" key="menu" entriesSections={menuEntriesSections}>
            <div className={b('preset-name')()}>
              <span className={b('preset-name-title')()}>
                {t('LAYOUT:PRESET-LABEL')} ({activePreset && activePreset.name})
              </span>
              <span className={b('preset-name-arrow')()} />
            </div>
          </Menu>
        </div>
        <div className={b('option')()} onClick={this.handleAddWidgetIconClick}>
          <Icon className={b('icon')()} src={require('./img/plus-icon-inline.svg')} />
          <span className={b('option-caption')()}>
            Widgets
          </span>
        </div>
      </div>
    );
  }

  @bind
  private handleSavePresetClick() {
    const { currentPresetsLayouts, presets, saveCurrentPresetsLayouts } = this.props;
    if (arePresetsLayoutsChanged(currentPresetsLayouts, presets)) {
      saveCurrentPresetsLayouts();
    }
  }

  @bind
  private handleCopyPresetClick() {
    this.props.setModalDisplayStatus({ name: 'newPresetDialog', status: true });
  }

  @bind
  private handleManagePresetsClick() {
    this.props.setModalDisplayStatus({ name: 'managePresets', status: true });
  }

  @bind
  private makePresetMenuEntryHandler(name: string) {
    return () => {
      this.props.saveUserConfig({ activePresetName: name });
    };
  }

  @bind
  private handleAddWidgetIconClick() {
    this.props.setModalDisplayStatus({ name: 'addWidgetDialog', status: true });
  }
}

export default featureConnect({
  widgetsFeatureEntry: features.widgets.loadEntry,
})(connect(mapState, mapDispatch)(i18nConnect(ClassicTradeWidgetOptions)));
