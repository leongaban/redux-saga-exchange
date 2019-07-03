import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bind } from 'decko';

import * as features from 'features';
import { featureConnect } from 'core';
import { Action } from 'shared/types/redux';
import { BalanceModalNames, IBalanceModalsState, ICurrencyPair } from 'shared/types/models';
import { ISwitchableMobileContentProps } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';

import { MBalanceTab } from '../../../../namespace';
import { MTradeClassicTab } from '../../../../../Trade/namespace';
import routes from '../../../../../routes';

interface IOwnProps {
  balanceEntry: features.balance.Entry;
  assetsEntry: features.assets.Entry;
}

interface IStateProps {
  balanceModals: IBalanceModalsState;
}

interface IDispatchProps {
  setModalProps: Action<features.balance.namespace.ISetModalProps<BalanceModalNames>>;
  loadDepositAddress: Action<features.balance.namespace.ILoadDepositAddress>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps & ISwitchableMobileContentProps<MBalanceTab>
  & RouteComponentProps<{}>;

function mapState(state: IAppReduxState, { balanceEntry }: IOwnProps): IStateProps {
  return {
    balanceModals: balanceEntry.selectors.selectModals(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IDispatchProps {
  return bindActionCreators(featureProps.balanceEntry.actions, dispatch);
}

class MBalanceLayout extends React.PureComponent<IProps> {
  public render() {
    const { assetsEntry, balanceEntry, balanceModals, setModalProps, loadDepositAddress } = this.props;

    if (balanceModals.withdrawCoins.isOpen) {
      return <balanceEntry.containers.MWithdrawCoinsDialog />;
    }

    if (balanceModals.depositCoins.isOpen) {
      return <balanceEntry.containers.MDepositCoinsDialog />;
    }

    if (balanceModals.simplex.isOpen) {
      return <balanceEntry.containers.MSimplexDialog />;
    }

    return (
      <assetsEntry.containers.MAssets
        setModalProps={setModalProps}
        loadDepositAddress={loadDepositAddress}
        onTradeMenuEntrySelect={this.handleAssetsTradeMenuEntrySelect}
      />
    );
  }

  @bind
  private handleAssetsTradeMenuEntrySelect(x: ICurrencyPair) {
    const tab: MTradeClassicTab = 'trade';
    this.props.history.push(routes.trade.classic.getPath({ tab, pair: x.id }));
  }
}

export default (
  featureConnect({
    balanceEntry: features.balance.loadEntry,
    assetsEntry: features.assets.loadEntry,
  })(
    connect(mapState, mapDispatch)(
      MBalanceLayout,
    )));
