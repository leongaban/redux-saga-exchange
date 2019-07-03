import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import { Responsive, Layout, Layouts, WidthProvider } from 'react-grid-layout';
import { createSelector } from 'reselect';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as R from 'ramda';

import { IAppReduxState, Omit, DeepPartial } from 'shared/types/app';
import { Action } from 'shared/types/redux';
import {
  IPreset, IWidgetLayout, IWidgets, WidgetKind, IResponsiveLayouts, IWidgetData, WidgetSettings, WidgetsSettings,
  HeaderLeftPart, HeaderLeftPartView, ICopyOrderToWidgetPayload, ICurrencyPair, IHeaderLeftPartWithSettings,
  IPresetLayouts, ICopyOrderToModalPayload,
} from 'shared/types/models';
import { settingsDefaults, notDraggableClassName } from 'shared/constants';
import { b as widgetTemplateB } from 'shared/view/components/WidgetTemplate/WidgetTemplate';
import { WidgetTemplate } from 'shared/view/components';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { actions, selectors } from '../../../redux';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import AddWidgetDialog from '../AddWidgetDialog/AddWidgetDialog';

import * as NS from '../../../namespace';
import './Widgets.scss';

const ResponsiveGrid = WidthProvider(Responsive);

const scrollableWidgetKinds: WidgetKind[] = [];

interface IStateProps {
  modals: NS.IReduxState['ui']['modals'];
  currentPresetsLayouts: IPresetLayouts[];
}

interface IActionProps {
  removeWidget: typeof actions.removeWidget;
  reset: typeof actions.reset;
  setCurrentPresetsLayouts: typeof configActions.setCurrentPresetsLayouts;
  setWidgetSettings: Action<NS.ISetWidgetSettings>;
  setModalDisplayStatus: Action<NS.ISetModalDisplayStatus>;
}

interface IOwnProps {
  preset: IPreset;
  widgets: IWidgets;
  currentCurrencyPair: ICurrencyPair;
  copyOrderToModal(payload: ICopyOrderToModalPayload): void;
  copyOrderToWidget(payload: ICopyOrderToWidgetPayload): void;
  copyToChatMessage(message: string): void;
}

type IProps = IActionProps & IStateProps & IOwnProps & ITranslateProps;

export interface IWidgetKinds {
  [uid: string]: WidgetKind;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    modals: selectors.selectModals(state),
    currentPresetsLayouts: configSelectors.selectCurrentPresetsLayouts(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    removeWidget: actions.removeWidget,
    reset: actions.reset,
    setCurrentPresetsLayouts: configActions.setCurrentPresetsLayouts,
    setWidgetSettings: actions.setWidgetSettings,
    setModalDisplayStatus: actions.setModalDisplayStatus,
  }, dispatch);
}

const b = block('widgets');

interface IState {
  settingsDialogWidgetData: IWidgetData | null;
  isWidgetInFullscreenMode: boolean;
}

const gridMargin: [number, number] = [5, 5];

class Widgets extends React.PureComponent<IProps, IState> {
  public state: IState = {
    settingsDialogWidgetData: null,
    isWidgetInFullscreenMode: false,
  };

  private cols = { lg: 96, md: 72, sm: 72, xs: 48, xxs: 24 };
  private breakpoints = { lg: 1366, md: 1024, sm: 800, xs: 648, xxs: 400 };

  private getHeaderLeftPartViewWithSettings = R.memoizeWith(R.identity, <S extends WidgetSettings>(
    uid: string, kind: WidgetKind, headerLeftPart: IHeaderLeftPartWithSettings<S>,
  ): HeaderLeftPartView => {

    const { copyOrderToModal, copyToChatMessage } = this.props;

    const Content = headerLeftPart.Content as IHeaderLeftPartWithSettings<WidgetSettings>['Content'];

    return {
      kind: 'with-custom-content',
      Content: () => (
        <Content
          onSettingsSave={this.makeWidgetSettingsSetter({ kind, uid })}
          settings={this.getWidgetSettings(kind, uid)}
          currentCurrencyPair={this.props.currentCurrencyPair}
          copyOrderToModal={copyOrderToModal}
          copyToChatMessage={copyToChatMessage}
          instanceKey={uid}
        />
      ),
    };
  });

  private selectContentRenderer = createSelector(
    (props: IProps) => props.currentCurrencyPair,
    (props: IProps) => props.preset.settings,
    (pair: ICurrencyPair, settings: WidgetsSettings) =>
      this.makeContentRenderer(
        pair, settings,
      )
  );

  private makeWidgetSettingsClickHandler = R.memoizeWith((x: IWidgetData) => x.uid, (widgetData: IWidgetData) => {
    return () => {
      this.setState(() => ({ settingsDialogWidgetData: widgetData }));
      this.props.setModalDisplayStatus({ name: 'settingsDialog', status: true });
    };
  });

  private makeWidgetSettingsSetter = R.memoizeWith((x: IWidgetData) => x.uid, (data: IWidgetData) => {
    const { setWidgetSettings } = this.props;
    return (settingsUpdate: DeepPartial<WidgetSettings>) => setWidgetSettings({ ...data, settingsUpdate });
  });

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const { preset, widgets } = this.props;
    return (
      <div className={b()} key={preset.name}>
        {this.renderSettingsDialog()}
        <AddWidgetDialog widgets={widgets} />
        <ResponsiveGrid
          className={b()}
          cols={this.cols}
          breakpoints={this.breakpoints}
          layouts={this.rejectDisabledWidgets(preset.layouts)}
          rowHeight={10}
          margin={gridMargin}
          draggableHandle={`.${widgetTemplateB('header')}`}
          draggableCancel={`.${notDraggableClassName}`}
          useCSSTransforms={false}
          onLayoutChange={this.handleLayoutChange}
          measureBeforeMount
        >
          {this.renderPreset(preset)}
        </ResponsiveGrid>
      </div>
    );
  }

  private renderSettingsDialog() {
    const { settingsDialogWidgetData } = this.state;
    if (settingsDialogWidgetData) {
      const { widgets, preset: { settings }, modals } = this.props;
      const { kind, uid } = settingsDialogWidgetData;
      const settingsForm = widgets[kind].settingsForm;

      if (settingsForm) {

        const { name, Component } = settingsForm;
        const Form = (props: any) => (
          <Component
            initialSettings={settings[kind][uid]}
            {...props}
          />
        );

        return (
          <SettingsDialog
            isOpen={modals.settingsDialog.isOpen}
            onClose={this.handleSettingsDialogClose}
            Form={Form}
            formName={name}
            onFormSubmit={this.makeWidgetSettingsSetter(settingsDialogWidgetData)}
          />
        );
      }

      console.warn('settings not implemented for widget kind', kind);
    }
  }

  @bind
  private handleSettingsDialogClose() {
    this.props.setModalDisplayStatus({ name: 'settingsDialog', status: false });
  }

  private rejectDisabledWidgets(layouts: IResponsiveLayouts): IResponsiveLayouts {
    const { widgets } = this.props;
    const rejectDisabled = R.reject((l: IWidgetLayout) => {
      const disabled = widgets[l.kind].disabled;
      return !l.kind ||
        disabled === undefined
        ? false
        : disabled;
    });

    return R.map(
      (xs: IWidgetLayout[] | undefined): IWidgetLayout[] | undefined =>
        xs && rejectDisabled(xs),
      layouts,
    );
  }

  private renderPreset(x: IPreset) {
    const { layouts: { lg } } = x;
    const { widgets } = this.props;
    if (lg) {
      const rejectDisabled = R.reject((l: IWidgetLayout) => {
        const disabled = widgets[l.kind].disabled;
        return !l.kind ||
          disabled === undefined
          ? false
          : disabled;
      });
      return rejectDisabled(lg).map(this.renderWidget);
    }
    return null;
  }

  private makeHeaderLeftPartView<S extends WidgetSettings>(
    headerLeftPart: HeaderLeftPart<S>, kind: WidgetKind, uid: string,
  ): HeaderLeftPartView {
    switch (headerLeftPart.kind) {
      case 'with-settings':
        return this.getHeaderLeftPartViewWithSettings(uid, kind, headerLeftPart);
      default:
        return headerLeftPart;
    }
  }

  private makeContentRenderer(
    currentCurrencyPair: ICurrencyPair,
    settings: WidgetsSettings,
  ) {
    return (uid: string, kind: WidgetKind) => {
      const { copyOrderToModal, copyOrderToWidget, copyToChatMessage, widgets } = this.props;
      const { Content } = widgets[kind];

      const storedSettings = settings[kind][uid];
      const widgetSettings = storedSettings
        ? storedSettings
        : settingsDefaults.widgetSettings[kind];
      return (
        <Content
          instanceKey={uid}
          currentCurrencyPair={currentCurrencyPair}
          settings={widgetSettings}
          onSettingsSave={this.makeWidgetSettingsSetter({ kind, uid })}
          copyOrderToModal={copyOrderToModal}
          copyOrderToWidget={copyOrderToWidget}
          copyToChatMessage={copyToChatMessage}
          isWidgetInFullscreenMode={this.state.isWidgetInFullscreenMode}
        />
      );
    };
  }

  @bind
  private renderWidget({ kind, i }: IWidgetLayout) {
    const { widgets, translate: t } = this.props;
    const { headerLeftPart, removable = true, titleI18nKey, settingsForm } = widgets[kind];
    // TODO fix i type
    const renderContent = this.selectContentRenderer(this.props);
    const onFullscreenSwitch = (() => {
      switch (kind) {
        case 'chart':
          return this.handleWidgetFullscreenSwitch;
        default:
          break;
      }
    })();

    return (
      <div key={i} data-name={kind}>
        <WidgetTemplate
          key={i}
          headerLeftPartView={this.makeHeaderLeftPartView(headerLeftPart, kind, i!)}
          uid={i!}
          onSettingsClick={settingsForm && this.makeWidgetSettingsClickHandler({ uid: i!, kind })}
          onCloseClick={removable ? this.handleWidgetCloseClick : void (0)}
          title={t(titleI18nKey)}
          scrollable={scrollableWidgetKinds.includes(kind)}
          onFullscreenSwitch={onFullscreenSwitch}
        >
          {renderContent(i!, kind)}
        </WidgetTemplate>

      </div>
    );
  }

  private getWidgetSettings(kind: WidgetKind, uid: string) {
    const storedSettings = this.props.preset.settings[kind][uid];
    return storedSettings
      ? storedSettings
      : settingsDefaults.widgetSettings[kind];
  }

  @bind
  private handleWidgetCloseClick(uid: string) {
    const { preset, removeWidget } = this.props;
    removeWidget({ presetName: preset.name, widgetUID: uid });
  }

  @bind
  private handleLayoutChange({ }: Layout, layouts: Layouts) {
    const {
      setCurrentPresetsLayouts,
      currentPresetsLayouts,
      preset: { name: presetName },
    } = this.props;

    const currentPresetIndex = currentPresetsLayouts.findIndex(x => x.name === presetName);

    if (currentPresetIndex === -1) {
      console.error('tried to update unexisting preset with name', presetName, '\npresets:', currentPresetsLayouts);
    } else {
      // TODO widget kinds are injected because react-grid-layout removes them at this stage
      // storing them separately might be a better option in terms of perfomance
      const updater = (preset: IPresetLayouts): IPresetLayouts => {
        const widgetKinds: IWidgetKinds = preset.layouts.lg!.reduce((acc: IWidgetKinds, x: IWidgetLayout) =>
          ({ ...acc, [x.i!]: x.kind }), {});

        const newLayouts: IResponsiveLayouts = R.map((xs: Layout[] | undefined): IWidgetLayout[] | undefined => {
          return xs && xs.map((x: Layout): IWidgetLayout => ({
            ...(x as Omit<IWidgetLayout, 'kind'>),
            kind: widgetKinds[x.i!]
          }));
        }, layouts);

        return {
          ...preset,
          layouts: newLayouts
        };
      };
      const updatedPresets = R.adjust(updater, currentPresetIndex, currentPresetsLayouts);
      setCurrentPresetsLayouts(updatedPresets);
    }
  }

  @bind
  private handleWidgetFullscreenSwitch() {
    this.setState((prevState: IState) => ({
      isWidgetInFullscreenMode: !prevState.isWidgetInFullscreenMode,
    }));
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      Widgets,
    ),
  )
);
