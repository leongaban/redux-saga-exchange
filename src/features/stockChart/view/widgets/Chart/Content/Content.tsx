import * as React from 'react';
import block from 'bem-cn';

import { MarketDepthChart } from 'shared/view/components';
import { IAppReduxState } from 'shared/types/app';
import {
  IStockChartSettings, IWidgetContentProps, ITradeOrders,
} from 'shared/types/models';
import { selectors as orderBookDSSelectors } from 'services/orderBookDataSource';
import { multiConnect, IMultiConnectProps } from 'shared/helpers/redux/multiConnect';

import { IReduxState } from '../../../../namespace';
import initialState from '../../../../redux/initial';
import { selectors } from '../../../../redux';
import { TVChartContainer, StockChartContainer } from '../../../containers';
import './Content.scss';

interface IStateProps {
  error?: string;
  orders: ITradeOrders;
}

type IProps = IStateProps & IWidgetContentProps<IStockChartSettings>
  & IMultiConnectProps;

const b = block('stockchart-widget-content');

class StockChartWidget extends React.PureComponent<IProps> {
  public render() {
    return (
      <div className={b()}>
        {this.renderContent()}
      </div>
    );
  }

  private renderContent() {
    const { settings: { activeChartKind, candlesticksChartKind }, orders } = this.props;
    switch (activeChartKind) {
      case 'candlesticks':
        if (candlesticksChartKind === 'trading-view') {
          return <TVChartContainer {...this.props} />; // TODO fix spread because containers not need all props
        } else {
          return <StockChartContainer {...this.props} />;
        }
      case 'depth':
        return <MarketDepthChart tradeOrders={orders} />;
      default:
        console.warn(' Unknown activeChartKind', activeChartKind);
        break;
    }
  }
}

function mapStateToProps(state: IReduxState, appState: IAppReduxState, ownProps: IProps): IStateProps {
  return {
    error: selectors.selectError(state),
    orders: orderBookDSSelectors.selectOrders(appState),
  };
}

export default multiConnect
  <IReduxState, IStateProps, {}, IWidgetContentProps<IStockChartSettings>>
  (['stockChartWidget'], initialState, mapStateToProps, () => ({}))(StockChartWidget);
