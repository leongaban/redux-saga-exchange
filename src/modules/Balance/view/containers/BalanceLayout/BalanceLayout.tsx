import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import block from 'bem-cn';
import { bind } from 'decko';

import featureConnect from 'core/FeatureConnector';
import * as features from 'features';
import { Action } from 'shared/types/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { BalanceModalNames, ICurrencyPair, IExchangeRatesVisibleColumns } from 'shared/types/models';
import Preloader from 'shared/view/elements/Preloader/Preloader';
import * as protectorService from 'services/protector';

import routes from '../../../../routes';
import './BalanceLayout.scss';

interface IOwnProps {
  balanceEntry: features.balance.Entry;
  assetsEntry: features.assets.Entry;
  operationHistoryFeature: features.operationHistory.Entry;
  exchangeRatesEntry: features.exchangeRates.Entry;
}

interface IDispatchProps {
  loadDepositAddress: Action<features.balance.namespace.ILoadDepositAddress>;
  setModalProps: Action<features.balance.namespace.ISetModalProps<BalanceModalNames>>;
  toggleVerificationModalState(): void;
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    loadDepositAddress: featureProps.balanceEntry.actions.loadDepositAddress,
    setModalProps: featureProps.balanceEntry.actions.setModalProps,
    toggleVerificationModalState: protectorService.actions.toggleVerificationModalState,
  }, dispatch);
}

type IProps = IOwnProps & IDispatchProps & RouteComponentProps<{}> & ITranslateProps;

const b = block('balance-layout');

class BalanceLayout extends React.PureComponent<IProps> {

  private columnsToDisplay: IExchangeRatesVisibleColumns = {
    changePercent: true,
    current: true,
    changeAbsolute: true,
  };

  public render() {

    const {
      balanceEntry, assetsEntry, exchangeRatesEntry, operationHistoryFeature,
      loadDepositAddress, setModalProps, translate: t
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('row')()}>
          <div className={b('cell', { 'estimated-value': true })()}>
            <assetsEntry.containers.EstimatedValue />
          </div>
          <div className={b('cell', { 'exchange-rates': true })()}>
            <div className={b('cell-header')()}>{t('BALANCE-LAYOUT:EXCHANGE-RATES-HEADER')}</div>
            <exchangeRatesEntry.containers.ExchangeRates columnsToDisplay={this.columnsToDisplay} />
          </div>
        </div>
        <div className={b('row', { 'with-border': true, 'assets': true })()}>
          <assetsEntry.containers.Assets
            loadDepositAddress={loadDepositAddress}
            setModalProps={setModalProps}
            onTradeMenuEntrySelect={this.handleAssetsTradeMenuEntrySelect}
          />
        </div>
        <div className={b('row', { 'with-border': true, 'fixed-height': 'large', 'operation-history': true })()}>
          <div className={b('row-header')()}>
            <div className={b('row-title')()}>{t('BALANCE-LAYOUT:OPERATION-HISTORY-HEADER')}</div>
            <operationHistoryFeature.containers.Header />
          </div>
          <operationHistoryFeature.containers.OperationHistory />
        </div>
        <balanceEntry.containers.Modals />
      </div>
    );
  }

  @bind
  private handleAssetsTradeMenuEntrySelect(x: ICurrencyPair) {
    this.props.history.push(routes.trade.classic.getPath({ pair: x.id }));
  }
}

export default (
  withRouter(
    featureConnect({
      balanceEntry: features.balance.loadEntry,
      assetsEntry: features.assets.loadEntry,
      exchangeRatesEntry: features.exchangeRates.loadEntry,
      operationHistoryFeature: features.operationHistory.loadEntry,
    }, <Preloader isShow />)(
      connect(null, mapDispatch)(
        i18nConnect(
          BalanceLayout,
        )
      )
    )
  )
);
