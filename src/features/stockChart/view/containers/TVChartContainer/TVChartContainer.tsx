import { bindActionCreators, Dispatch } from 'redux';
import React from 'react';
import { bind } from 'decko';

import {
  IStockChartSettings,
  IWidgetContentProps,
} from 'shared/types/models/index';
import { multiConnect, IMultiConnectProps } from 'shared/helpers/redux/multiConnect/index';
import { actions as chartActions } from 'services/chart/index';
import { selectors as configSelectors } from 'services/config';
import { UITheme } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { TVChart } from 'shared/view/components';

import { selectors, actions, initialState } from '../../../redux';
import * as NS from '../../../namespace';
import Datafeed from './Datafeed';

interface IDispatchProps {
  openChannel: typeof chartActions.openChannel;
  closeChannel: typeof chartActions.closeChannel;
  executeCommand: typeof actions.executeCommand;
  reset: typeof actions.reset;
  setModalDisplayStatus: typeof actions.setModalDisplayStatus;
  subscribeToEvent: typeof chartActions.subscribeToEvent;
  unsubscribeFromEvent: typeof chartActions.unsubscribeFromEvent;
}

interface IStateProps {
  isIndicatorsDialogOpened: boolean;
  uiTheme: UITheme;
}

type IProps =
  IDispatchProps
  & IStateProps
  & IWidgetContentProps<IStockChartSettings>
  & IMultiConnectProps;

class TVChartContainer extends React.PureComponent<IProps> {
  private datafeed: Datafeed = (() => {
    const {
      openChannel, executeCommand, subscribeToEvent, instanceKey,
      unsubscribeFromEvent, currentCurrencyPair, closeChannel,
    } = this.props;
    const dataFeed = new Datafeed({
      instanceKey,
      openChannel,
      closeChannel,
      executeCommand,
      subscribeToEvent,
      unsubscribeFromEvent,
    });
    dataFeed.setCurrentCurrencyPair(currentCurrencyPair);
    return dataFeed;
  })();

  public componentDidUpdate({ currentCurrencyPair: prevCurrencyPair }: IProps) {
    const { currentCurrencyPair, reset } = this.props;
    if (prevCurrencyPair.id !== currentCurrencyPair.id) {
      reset();
      this.datafeed.setCurrentCurrencyPair(currentCurrencyPair);
    }
  }

  public render() {
    const {
      currentCurrencyPair: { id }, settings: { interval, periodicity, tvIndicators, barStyle },
      isIndicatorsDialogOpened, instanceKey, uiTheme,
    } = this.props;
    return (
      <TVChart
        symbol={id}
        containerId={instanceKey}
        datafeed={this.datafeed}
        interval={interval}
        periodicity={periodicity}
        indicators={tvIndicators}
        barStyle={barStyle}
        uiTheme={uiTheme}
        onIndicatorsSave={this.handleIndicatorsSave}
        isIndicatorsDialogOpened={isIndicatorsDialogOpened}
        setModalDisplayStatus={this.handleSetIndicatorsDialogState}
      />
    );
  }

  @bind
  private handleIndicatorsSave(tvIndicators: string[]) {
    this.props.onSettingsSave({ tvIndicators });
  }

  @bind
  private handleSetIndicatorsDialogState(status: boolean) {
    const { setModalDisplayStatus } = this.props;
    setModalDisplayStatus({
      name: 'indicatorsDialog',
      status,
    });
  }
}

function mapStateToProps(state: NS.IReduxState, appState: IAppReduxState): IStateProps {
  return {
    isIndicatorsDialogOpened: selectors.selectIndicatorsDialogState(state),
    uiTheme: configSelectors.selectUITheme(appState),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    subscribeToEvent: chartActions.subscribeToEvent,
    unsubscribeFromEvent: chartActions.unsubscribeFromEvent,
    openChannel: chartActions.openChannel,
    closeChannel: chartActions.closeChannel,
    executeCommand: actions.executeCommand,
    reset: actions.reset,
    setModalDisplayStatus: actions.setModalDisplayStatus,
  }, dispatch);
}

export default multiConnect<
  NS.IReduxState,
  IStateProps,
  IDispatchProps,
  IWidgetContentProps<IStockChartSettings>
  >(['stockChartWidget'], initialState, mapStateToProps, mapDispatchToProps)(
    TVChartContainer,
);
