import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';
import { Modal, Select, Button } from 'shared/view/elements';
import { WidgetKind, IWidgets, WidgetSettings, IPreset, WidgetFormSettings } from 'shared/types/models';
import { settingsDefaults } from 'shared/constants';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';

import { actions, selectors } from '../../../redux';
import './AddWidgetDialog.scss';

interface IOwnProps {
  widgets: IWidgets;
}

type IProps = ITranslateProps & IOwnProps & IStateProps & IActionProps;

interface IState {
  selectedWidgetKind: WidgetKind;
}

interface IStateProps {
  isOpen: boolean;
  activePreset?: IPreset;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    isOpen: selectors.selectModals(state).addWidgetDialog.isOpen,
    activePreset: configSelectors.selectActivePreset(state),
  };
}

interface IActionProps {
  addWidget: typeof actions.addWidget;
  setModalDisplayStatus: typeof actions.setModalDisplayStatus;
  submitForm: typeof submit;
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({ submitForm: submit, ...actions }, dispatch);
}

const b = block('add-widget-dialog');

class AddWidgetDialog extends React.PureComponent<IProps, IState> {
  public state: IState = {
    selectedWidgetKind: ((): WidgetKind => {
      const { widgets } = this.props;
      return R.keys(widgets)[0] as WidgetKind;
    })(),
  };

  public render() {
    const { translate: t, isOpen, widgets } = this.props;
    const { selectedWidgetKind } = this.state;

    const widgetSelectOptions =
      R.keys(widgets).filter((kind: WidgetKind) => widgets[kind].removable && !widgets[kind].disabled);

    return (
      <Modal
        title={t('WIDGETS:ADD-WIDGET-DIALOG:TITLE')}
        isOpen={isOpen}
        onClose={this.closeModal}
        hasBotttomBorderAtHeader
      >
        <div className={b()}>
          <div className={b('section', { 'with-bottom-border': true })()}>
            <div className={b('widget-name-select-label')()}>
              {t('WIDGETS:WIDGET-NAME-SELECT-LABEL')}
            </div>
            <div className={b('widget-name-select')()}>
              <Select
                options={widgetSelectOptions}
                selectedOption={selectedWidgetKind}
                onSelect={this.handleWidgetNameSelect}
                optionValueKey={this.getWidgetNameOptionText}
              />
            </div>
          </div>
          <div className={b('section')()}>
            {this.renderForm()}
          </div>
          <div className={b('buttons')()}>
            <div className={b('button')()}>
              <Button size="medium" color="black-white" type="button" onClick={this.closeModal}>
                {t('SHARED:BUTTONS:CANCEL')}
              </Button>
            </div>
            <div className={b('button')()}>
              <Button size="medium" color="green" type="button" onClick={this.handleAddWidgetButtonClick}>
                {t('WIDGETS:ADD-WIDGET-DIALOG:ADD-BUTTON-TEXT')}
              </Button>
            </div>
          </div>
        </div >
      </Modal>
    );
  }

  @bind
  private closeModal() {
    this.props.setModalDisplayStatus({ name: 'addWidgetDialog', status: false });
  }

  private renderForm() {
    const { widgets } = this.props;
    const { selectedWidgetKind } = this.state;
    const { settingsForm } = widgets[selectedWidgetKind];
    if (settingsForm) {
      const { Component, name } = settingsForm;
      return (
        <Component
          initialSettings={settingsDefaults.widgetSettings[selectedWidgetKind] as WidgetFormSettings}
          onSubmit={this.makeFormSubmitHandler(name, selectedWidgetKind)}
        />
      );
    }
  }

  private makeFormSubmitHandler(name: string, kind: WidgetKind) {
    return (settings: WidgetFormSettings) => {

      const defaultSettings = settingsDefaults.widgetSettings[kind];
      if (defaultSettings === null) {
        this.addWidget(null);
      } else {
        this.addWidget(R.mergeDeepRight(defaultSettings, settings));
      }
      this.closeModal();
    };
  }

  @bind
  private handleAddWidgetButtonClick() {
    const { submitForm, widgets } = this.props;
    const { selectedWidgetKind } = this.state;
    const { settingsForm } = widgets[selectedWidgetKind];

    if (settingsForm) {
      submitForm(settingsForm.name);
    } else {
      this.addWidget(settingsDefaults.widgetSettings[selectedWidgetKind]);
      this.closeModal();
    }
  }

  @bind
  private addWidget(settings: WidgetSettings) {
    const { selectedWidgetKind } = this.state;
    const { addWidget, activePreset } = this.props;
    if (activePreset) {
      addWidget({ kind: selectedWidgetKind, presetName: activePreset.name, settings });
    } else {
      console.error('expected initialized active preset');
    }
  }

  @bind
  private getWidgetNameOptionText(x: WidgetKind) {
    const { widgets, translate: t } = this.props;
    return t(widgets[x].titleI18nKey);
  }

  @bind
  private handleWidgetNameSelect(x: WidgetKind) {
    this.setState({ selectedWidgetKind: x });
  }
}

export default (
  connect<IStateProps, IActionProps, IOwnProps>(mapState, mapDispatch)(
    i18nConnect(
      AddWidgetDialog,
    ),
  )
);
