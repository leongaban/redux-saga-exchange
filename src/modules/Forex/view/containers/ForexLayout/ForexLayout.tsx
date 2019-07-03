import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { featureConnect } from 'core';
import * as features from 'features';
import { bind } from 'decko';

import routes from 'modules/routes';
import { Action, ICommunication } from 'shared/types/redux';
import Preloader from 'shared/view/elements/Preloader/Preloader';
import { IAppReduxState } from 'shared/types/app';

interface IOwnProps {
  forexEntry: features.forex.Entry;
  balanceEntry: features.balance.Entry;
}

interface IDispatchProps {
  withdrawCoins: Action<features.balance.namespace.IWithdrawCoins>;
}

interface IStateProps {
  withdrawCoinsCommunication: ICommunication;
}

function mapState(state: IAppReduxState, featureProps: IOwnProps): IStateProps {
  const { selectors } = featureProps.balanceEntry;
  return {
    withdrawCoinsCommunication: selectors.selectCommunication(state, 'withdrawCoins')
  };
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    withdrawCoins: featureProps.balanceEntry.actions.withdrawCoins
  }, dispatch);
}

type IProps = RouteComponentProps<{}> & IDispatchProps & IOwnProps & IStateProps;

class ForexLayout extends React.PureComponent<IProps> {
  public render() {
    const {
      forexEntry,
      withdrawCoins, withdrawCoinsCommunication
    } = this.props;
    const { containers: { Forex } } = forexEntry;

    return (
      <div>
        <Forex
          forexModalClosed={this.redirectToTradeView}
          withdrawCoins={withdrawCoins}
          withdrawCoinsCommunication={withdrawCoinsCommunication}
        />
      </div>
    );
  }

  @bind
  private redirectToTradeView() {
    this.props.history.push(routes.trade.classic.getPath());
  }
}

export default (
  withRouter(
    featureConnect({
      forexEntry: features.forex.loadEntry,
      balanceEntry: features.balance.loadEntry,
    }, <Preloader isShow />)(
      connect<IStateProps, IDispatchProps, IOwnProps>(mapState, mapDispatch)(
        ForexLayout,
      ))
  )
);
