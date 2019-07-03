import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { featureConnect } from 'core';
import { parse } from 'query-string';
import { withRouter, RouteComponentProps } from 'react-router';

import { IAppReduxState } from 'shared/types/app';
import { Action, ICommunication } from 'shared/types/redux';
import { IPreset, IWidgets, ICurrencyPair } from 'shared/types/models';
import { ErrorBoundary, ErrorScreen } from 'shared/view/components';
import { Preloader } from 'shared/view/elements';
import * as features from 'features';
import { OrderBookDataSource } from 'services/orderBookDataSource';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import NavigationPrompt from 'modules/shared/NavigationPrompt/NavigationPrompt';
import { convertToPresetLayouts } from 'shared/helpers/converters';

import './TradePage.scss';

interface IFeatureProps {
  widgetsFeatureEntry: features.widgets.Entry;
  exchangeRatesEntry: features.exchangeRates.Entry;
  ordersFeatureEntry: features.orders.Entry;
  balanceFeatureEntry: features.balance.Entry;
  orderBookFeatureEntry: features.orderBook.Entry;
  chatFeatureEntry: features.chat.Entry;
  stockChartFeatureEntry: features.stockChart.Entry;
  tradeHistoryFeatureEntry: features.tradeHistory.Entry;
  operationHistoryFeatureEntry: features.operationHistory.Entry;
  placeOrderFeatureEntry: features.placeOrder.Entry;
  reportingFeatureEntry: features.reporting.Entry;
  announcementBarEntry: features.announcementBar.Entry;
}

interface IStateProps {
  activePreset?: IPreset;
  currentMarket?: string;
  widgetsModals: IAppReduxState['widgets']['ui']['modals'];
  currentCurrencyPair: ICurrencyPair | null;
  presets: IPreset[];
  communicationLoadUISettings: ICommunication;
  activeExchangeRatesWidgetUID: string | undefined;
  presetsHaveUnsavedChanges: boolean;
}

interface IActionProps {
  saveCurrentPresetsLayouts: typeof configActions.saveCurrentPresetsLayouts;
  setCurrentPresetsLayouts: typeof configActions.setCurrentPresetsLayouts;
  setModalDisplayStatus: Action<features.widgets.namespace.ISetModalDisplayStatus>;
  copyOrderToModal: Action<features.placeOrder.namespace.ICopyOrderToModal>;
  copyOrderToWidget: Action<features.placeOrder.namespace.ICopyOrderToWidget>;
  copyToMessage: Action<features.chat.namespace.ICopyToMessage>;
  setWidgetSettings: Action<features.widgets.namespace.ISetWidgetSettings>;
  setActivePresetWhenItDoesNotExist(): void;
}

type IProps = IFeatureProps & IStateProps & IActionProps & RouteComponentProps<{}>;

function mapState(state: IAppReduxState, featureProps: IFeatureProps): IStateProps {
  const { widgetsFeatureEntry } = featureProps;

  const currentCurrencyPairID = configSelectors.selectCurrentCurrencyPairID(state);
  const currentCurrencyPair = configSelectors.selectCurrentCurrencyPair(state);

  return {
    currentCurrencyPair,
    currentMarket: currentCurrencyPairID,
    activePreset: configSelectors.selectActivePreset(state),
    widgetsModals: widgetsFeatureEntry.selectors.selectModals(state),
    communicationLoadUISettings: configSelectors.selectLoadUserSettingsCommunication(state),
    activeExchangeRatesWidgetUID: widgetsFeatureEntry.selectors.selectActiveExchangeRatesWidgetUID(state),
    presetsHaveUnsavedChanges: configSelectors.selectPresetsHaveUnsavedChanges(state),
    presets: configSelectors.selectPresets(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IFeatureProps): IActionProps {
  return bindActionCreators(
    {
      saveCurrentPresetsLayouts: configActions.saveCurrentPresetsLayouts,
      setCurrentPresetsLayouts: configActions.setCurrentPresetsLayouts,
      ...featureProps.widgetsFeatureEntry.actions,
      ...featureProps.ordersFeatureEntry.actions,
      ...featureProps.chatFeatureEntry.actions,
      ...featureProps.placeOrderFeatureEntry.actions,
    },
    dispatch,
  );
}

const b = block('trade-page');

class TradePage extends React.PureComponent<IProps> {
  private newCurrentMarketID: string | undefined;

  private widgets: IWidgets = {
    'balance': this.props.balanceFeatureEntry.widgets.balance,
    'chart': this.props.stockChartFeatureEntry.widgets.Chart,
    'chat': this.props.chatFeatureEntry.widgets.Chat,
    'exchange-rates': this.props.exchangeRatesEntry.widgets.ExchangeRates,
    'order-book': this.props.orderBookFeatureEntry.widgets.OrderBook,
    'order-history': this.props.ordersFeatureEntry.widgets.OrderHistory,
    'order-list': this.props.ordersFeatureEntry.widgets.OrderList,
    'trade-history': this.props.tradeHistoryFeatureEntry.widgets.TradeHistory,
    'place-order': this.props.placeOrderFeatureEntry.widgets.PlaceOrder,
    'operation-history': this.props.operationHistoryFeatureEntry.widgets.OperationHistory,
    'reporting': this.props.reportingFeatureEntry.widgets.Reporting,
    'announcement-bar': this.props.announcementBarEntry.widgets.AnnouncementBar,
  };

  public componentDidMount() {
    const { location: { search }, activeExchangeRatesWidgetUID, currentCurrencyPair } = this.props;
    this.newCurrentMarketID = parse(search).pair ? parse(search).pair : undefined;

    if (currentCurrencyPair && activeExchangeRatesWidgetUID) {
      const currentMarketWasChanged = this.newCurrentMarketID !== currentCurrencyPair.id;

      if (this.newCurrentMarketID && currentMarketWasChanged) {
        this.updateCurrentMarketId(activeExchangeRatesWidgetUID);
      }

    }
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (this.newCurrentMarketID) {
      const { activeExchangeRatesWidgetUID } = nextProps;
      if (activeExchangeRatesWidgetUID) {
        this.updateCurrentMarketId(activeExchangeRatesWidgetUID);
        this.newCurrentMarketID = void 1;
      }
    }
  }

  public render() {
    const {
      widgetsFeatureEntry, widgetsModals, balanceFeatureEntry, communicationLoadUISettings, presetsHaveUnsavedChanges,
      currentCurrencyPair,
    } = this.props;
    const isShowPreload = communicationLoadUISettings.isRequesting;
    return (
      <div className={b()}>
        <widgetsFeatureEntry.containers.NewPresetDialog
          isOpen={widgetsModals.newPresetDialog.isOpen}
          onClose={this.handleNewPresetDialogClose}
        />
        <widgetsFeatureEntry.containers.ManagePresets
          isOpen={widgetsModals.managePresets.isOpen}
          onClose={this.handleManagePresetsClose}
        />
        <NavigationPrompt when={presetsHaveUnsavedChanges}>
          {({ handleConfirm, handleCancel }) => (
            <widgetsFeatureEntry.containers.SaveChangesDialog
              isOpen={true}
              onClose={handleCancel}
              onYesClick={this.makeSaveDialogYesClickHandler(handleConfirm)}
              onNoClick={this.makeSaveDialogNoClickHandler(handleConfirm)}
              onCancelClick={handleCancel}
            />
          )}
        </NavigationPrompt>
        <balanceFeatureEntry.containers.Modals />
        <Preloader isShow={isShowPreload} >
          {currentCurrencyPair &&
            currentCurrencyPair.id
            ? (
              <>
                <OrderBookDataSource currentMarket={currentCurrencyPair.id} />
              </>
            )
            : null
          }
          {this.renderContent()}
        </Preloader>
      </div>
    );
  }

  private updateCurrentMarketId(activeExchangeRatesWidgetUID: string) {
    const { setWidgetSettings } = this.props;
    setWidgetSettings({
      kind: 'exchange-rates',
      uid: activeExchangeRatesWidgetUID,
      settingsUpdate: { currentMarketId: this.newCurrentMarketID },
    });
  }

  private renderContent() {
    const {
      widgetsFeatureEntry, placeOrderFeatureEntry, copyOrderToModal, copyOrderToWidget, copyToMessage,
      activePreset, currentCurrencyPair,
    } = this.props;
    if (!activePreset) {
      return this.renderErrorScreen();
    }
    return currentCurrencyPair &&
      (
        <ErrorBoundary onButtonClick={this.handleReloadClick}>
          <placeOrderFeatureEntry.containers.PlaceOrderModal
            currentCurrencyPair={currentCurrencyPair}
          />
          <widgetsFeatureEntry.containers.Widgets
            preset={activePreset}
            widgets={this.widgets}
            currentCurrencyPair={currentCurrencyPair}
            copyOrderToModal={copyOrderToModal}
            copyOrderToWidget={copyOrderToWidget}
            copyToChatMessage={copyToMessage}
          />
        </ErrorBoundary>
      );
  }

  private renderErrorScreen() {
    return (
      <div className={b('error')()}>
        <ErrorScreen
          withIcon
          title="ERROR"
          message="Active preset is not found"
          buttonName="Set active preset"
          onButtonClick={this.handleSetActivePresetWhenItDoesNotExist}
        />
      </div>
    );
  }

  @bind
  private handleNewPresetDialogClose() {
    this.props.setModalDisplayStatus({ name: 'newPresetDialog', status: false });
  }

  @bind
  private handleManagePresetsClose() {
    this.props.setModalDisplayStatus({ name: 'managePresets', status: false });
  }

  @bind
  private handleReloadClick() {
    window.location.reload();
  }

  @bind
  private handleSetActivePresetWhenItDoesNotExist() {
    this.props.setActivePresetWhenItDoesNotExist();
  }

  @bind
  private makeSaveDialogYesClickHandler(defaultHandler: () => void) {
    return () => {
      this.props.saveCurrentPresetsLayouts();
      defaultHandler();
    };
  }

  @bind
  private makeSaveDialogNoClickHandler(defaultHandler: () => void) {
    const { presets, setCurrentPresetsLayouts } = this.props;
    return () => {
      setCurrentPresetsLayouts(presets.map(convertToPresetLayouts));
      defaultHandler();
    };
  }
}

export default (
  withRouter(
    featureConnect({
      widgetsFeatureEntry: features.widgets.loadEntry,
      exchangeRatesEntry: features.exchangeRates.loadEntry,
      ordersFeatureEntry: features.orders.loadEntry,
      balanceFeatureEntry: features.balance.loadEntry,
      orderBookFeatureEntry: features.orderBook.loadEntry,
      chatFeatureEntry: features.chat.loadEntry,
      stockChartFeatureEntry: features.stockChart.loadEntry,
      tradeHistoryFeatureEntry: features.tradeHistory.loadEntry,
      operationHistoryFeatureEntry: features.operationHistory.loadEntry,
      placeOrderFeatureEntry: features.placeOrder.loadEntry,
      reportingFeatureEntry: features.reporting.loadEntry,
      announcementBarEntry: features.announcementBar.loadEntry,
    }, <Preloader isShow />)(
      connect(mapState, mapDispatch)(
        TradePage,
      ))));
