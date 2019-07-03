import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { bind } from 'decko';
import uuid from 'uuid';

import { transferIdPrefixes } from 'shared/constants';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';
import { selectors as userSelectors } from 'services/user';
import { IAppReduxState } from 'shared/types/app';
import {
  IUser, fxPlatformLink, pricingLink, IForexAccount,
  windowsLink, macLink, webLink, iosLink, androidLink
} from 'shared/types/models';
import { Preloader } from 'shared/view/elements';
import { INotification } from 'shared/types/ui';
import { ICommunication } from 'shared/types/redux';
import { actions, selectors } from './../../../redux';

import { IWithdrawForexRequest, IWithdrawToForexRequest } from 'shared/types/requests';
import { ForexModal, MT5Widget, DepositWidget, WithdrawWidget, AccountWidget } from '../../components';
import './Forex.scss';

interface IStateProps {
  user: IUser | null;
  useForex: boolean;
  userAmountWithdrawn: number;
  userTioBalance: number;
  userEthBalance: number;
  userBtcBalance: number;
  exchangePrice: number;
  asset: string;
  mt5Balance: number;
  credit: number;
  leverage: number;
  equity: number;
  floating: number;
  freeMargin: number;
  margin: number;
  marginLevel: number;
  profit: number;
  exchangeRate: number;
  callingGetBalance: boolean;
  isBalanceFetching: boolean;
  isCreatingForexAcount: boolean;
  forexMessage: string;
  isWithdrawingFromMT5: boolean;
  mt5LoginId: number;
}

interface IActionProps {
  getForexBalance: typeof actions.getForexBalance;
  failForexModal: typeof actions.getUseForexFail;
  succeedForexModal: typeof actions.getUseForexSuccess;
  setNotification: typeof notificationActions.setNotification;
  createForexAccount: typeof actions.createForexAccount;
  withdrawFromMT5(request: IWithdrawForexRequest): void;
}

interface IOwnProps {
  withdrawCoinsCommunication: ICommunication;
  forexModalClosed(): void;
  withdrawCoins(request: IWithdrawToForexRequest): void;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  const {
    tiox: userTioBalance,
    btc: userBtcBalance,
    eth: userEthBalance
  } = userSelectors.selectBalanceDict(state);

  return {
    user: userSelectors.selectUser(state),
    useForex: selectors.selectCanUseForex(state),
    userAmountWithdrawn: selectors.selectUserAmountWithdrawn(state),
    mt5LoginId: selectors.selectMt5LoginId(state),
    forexMessage: selectors.selectForexMessage(state),
    asset: selectors.selectBaseAsset(state),
    mt5Balance: selectors.selectBalance(state),
    credit: selectors.selectCredit(state),
    leverage: selectors.selectLeverage(state),
    equity: selectors.selectEquity(state),
    floating: selectors.selectFloating(state),
    freeMargin: selectors.selectFreeMagin(state),
    margin: selectors.selectMargin(state),
    marginLevel: selectors.selectMarginLevel(state),
    profit: selectors.selectProfit(state),
    exchangeRate: selectors.selectExchangeRate(state),
    callingGetBalance: selectors.selectCheckCallBalance(state),
    userTioBalance,
    userEthBalance,
    userBtcBalance,
    exchangePrice: selectors.selectExchangeRate(state),
    isBalanceFetching: selectors.selectIsBalanceFetching(state),
    isCreatingForexAcount: selectors.selectIsCreatingForexAccount(state),
    isWithdrawingFromMT5: selectors.selectIsWithdrawingFromMT5(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    failForexModal: actions.getUseForexFail,
    succeedForexModal: actions.getUseForexSuccess,
    setNotification: notificationActions.setNotification,
    createForexAccount: actions.createForexAccount,
    getForexBalance: actions.getForexBalance,
    withdrawFromMT5: actions.withdrawFromMT5,
  }, dispatch);
}

const b = block('forex-mt5');

const fxMessages = [
  'Balance retrieved',
  'Deposit successful',
  'Success! You have withdrawn from MT5'
];

const mt5Links = {
  windows: windowsLink,
  mac: macLink,
  web: webLink,
  ios: iosLink,
  android: androidLink,
  fxPlatform: fxPlatformLink,
  fxPricing: pricingLink
};

class Forex extends React.PureComponent<IProps, IStateProps> {
  public componentDidMount() {
    const { user, getForexBalance } = this.props;

    if (user) {
      getForexBalance();
    }
  }

  public render() {
    const {
      useForex, user, exchangePrice, forexModalClosed,
      asset, mt5Balance, credit, leverage, floating, forexMessage, mt5LoginId,
      equity, freeMargin, margin, marginLevel, profit, exchangeRate,
      userAmountWithdrawn, withdrawCoinsCommunication,
      isBalanceFetching, isWithdrawingFromMT5, callingGetBalance
    } = this.props;

    const assetBalance = this.selectBaseAsset();
    const fxMessagesComplete = fxMessages.every(x => x !== forexMessage);
    const preloading = callingGetBalance && fxMessagesComplete || isWithdrawingFromMT5 && fxMessagesComplete;
    const displayModules = !callingGetBalance && forexMessage !== 'User has not created account';

    if (isBalanceFetching) {
      return <Preloader isShow />;
    }
    return (
      <div className={b()}>
        { displayModules ?
          <div>
            <div className={b('row')()}>
              <div className={b('tio-markets-logo')()}>
                <img src="./img/forex/PoweredByTIOMarkets.png"/>
              </div>
            </div>
            <div className={b('row')()}>
              <DepositWidget
                baseAsset={asset}
                exchangePrice={exchangePrice}
                leverage={leverage}
                isWithdrawing={withdrawCoinsCommunication.isRequesting}
                preloading={preloading}
                userAmountWithdrawn={userAmountWithdrawn}
                userBalance={assetBalance}
                onDepositBtnClick={this.handleDeposit}
                onNotification={this.handleOnNotification}
              />
              <WithdrawWidget
                userBalance={mt5Balance}
                freeMargin={freeMargin}
                baseAsset={asset}
                isWithdrawing={isWithdrawingFromMT5}
                preloading={preloading}
                onWithdrawBtnClick={this.handleWithdraw}
                onNotification={this.handleOnNotification}
              />
              <AccountWidget
                asset={asset}
                mt5LoginId={mt5LoginId}
                balance={mt5Balance}
                credit={credit}
                equity={equity}
                floating={floating}
                freeMargin={freeMargin}
                leverage={leverage}
                margin={margin}
                marginLevel={marginLevel}
                exchangeRate={exchangeRate}
                preloading={preloading}
                profit={profit}
              />
              <MT5Widget
                preloading={preloading}
                mt5Links={mt5Links}
              />
            </div>
          </div> : <ForexModal
            isOpen={!useForex}
            user={user}
            onForexModalCancel={forexModalClosed}
            onCreateAccount={this.handleCreateAccount}
          />
        }
      </div>
    );
  }

  @bind
  private handleCreateAccount(account: IForexAccount) {
    const { createForexAccount } = this.props;
    createForexAccount(account);
  }

  @bind
  private selectBaseAsset() {
    const { asset, userTioBalance, userEthBalance, userBtcBalance } = this.props;
    switch (asset) {
      case 'tiox':
        return userTioBalance;
      case 'btc':
        return userBtcBalance;
      case 'eth':
        return userEthBalance;
      default:
        return userTioBalance;
    }
  }

  @bind
  private handleDeposit(amount: number) {
    const { asset, withdrawCoins } = this.props;
    withdrawCoins({
      assetId: asset,
      amount,
      transferId: `${transferIdPrefixes.fx}-${uuid()}`,
      paymentSystem: '8',
    });
  }

  @bind
  private handleWithdraw(amount: number) {
    const { withdrawFromMT5 } = this.props;
    withdrawFromMT5({
      amount
    });
  }

  @bind
  private handleOnNotification(notification: INotification) {
    const { setNotification } = this.props;
    setNotification(notification);
  }
}

const translated = i18nConnect(Forex);
const connectedToRedux = connect<IStateProps, IActionProps, IOwnProps>(mapState, mapDispatch)(translated);

export default connectedToRedux;
export { Forex };
