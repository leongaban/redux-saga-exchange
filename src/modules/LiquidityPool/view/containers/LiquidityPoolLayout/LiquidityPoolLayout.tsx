import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Action, ICommunication } from 'shared/types/redux';
import { actions as notificationActions } from 'services/notification';
import { featureConnect } from 'core';
import * as features from 'features';
import Preloader from 'shared/view/elements/Preloader/Preloader';
import { IAppReduxState } from 'shared/types/app';
import { selectCommunication as liquidityPoolSelectors } from 'features/liquidityPool/redux/selectors';
import { selectVerifyCommunication } from 'services/protector/redux/data/selectors';

interface IOwnProps {
  liquidityPoolEntry: features.liquidityPool.Entry;
  balanceEntry: features.balance.Entry;
}

interface IDispatchProps {
  withdrawCoins: Action<features.balance.namespace.IWithdrawCoins>;
  setNotification: typeof notificationActions.setNotification;
}

interface IStateProps {
  verifyCommunication: ICommunication;
  withdrawCoinsCommunication: ICommunication;
  makePayoutCommunication: ICommunication;
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    withdrawCoins: featureProps.balanceEntry.actions.withdrawCoins,
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

function mapState(state: IAppReduxState, feaureProps: IOwnProps): IStateProps {
  const { selectors } = feaureProps.balanceEntry;
  return {
    verifyCommunication: selectVerifyCommunication(state),
    withdrawCoinsCommunication: selectors.selectCommunication(state, 'withdrawCoins'),
    makePayoutCommunication: liquidityPoolSelectors(state, 'makePayout'),
  };
}

type IProps = IDispatchProps & IOwnProps & IStateProps;

class LiquidityPoolLayout extends React.PureComponent<IProps> {
  public render() {
    const {
      liquidityPoolEntry, setNotification, withdrawCoins,
      withdrawCoinsCommunication, verifyCommunication,
      makePayoutCommunication
    } = this.props;
    const { containers: { LiquidityPool } } = liquidityPoolEntry;

    return (
      <div>
        <LiquidityPool
          verifyCommunication={verifyCommunication}
          withdrawCoins={withdrawCoins}
          setNotification={setNotification}
          withdrawCoinsCommunication={withdrawCoinsCommunication}
          makePayoutCommunication={makePayoutCommunication}
        />
      </div>
    );
  }
}

export default
  featureConnect({
    liquidityPoolEntry: features.liquidityPool.loadEntry,
    balanceEntry: features.balance.loadEntry,
  }, <Preloader isShow />)(
    connect<IStateProps, IDispatchProps, IOwnProps>(mapState, mapDispatch)(
      LiquidityPoolLayout,
    ));
