import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { bind } from 'decko';
import uuid from 'uuid';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors } from 'services/config';
import { selectors as userSelectors } from 'services/user';
import { transferIdPrefixes } from 'shared/constants';
import { ICommunication } from 'shared/types/redux';
import { isSuccessedByState } from 'shared/helpers/redux';
import { actions, selectors } from './../../../redux';
import { IAppReduxState } from 'shared/types/app';
import { IAssetsInfoMap, IUser } from 'shared/types/models';
import { IWithdrawToLPRequest, IPandaDocsRequest } from 'shared/types/requests';
import { INotification } from 'shared/types/ui';
import Preloader from 'shared/view/elements/Preloader/Preloader';

import { AssetsTable, Calculator, LPtermsOfService, TotalPayout, TioLockup, PandaDocModal } from '../../components';
import { ILPAsset } from 'shared/types/models/liquidityPool';
import { filterAssets, sumHistoricalPayouts } from 'shared/helpers/liquidityPool';
import './LiquidityPool.scss';

interface IStateProps {
  user: IUser | null;
  assetsInfo: IAssetsInfoMap;
  assets: ILPAsset[];
  assetFilter: string;
  convertedTioLocked: number;
  convertedTotalTio: number;
  conversionCurrency: string;
  tioPrice: number;
  tioLocked: number;
  timeValid: boolean;
  totalTio: number;
  pandaDocUrl?: string;
  pandaDocId: string;
  pandaDocUrlFetching: boolean;
  userTioBalance: number;
  useLiquidityPool: boolean;
  isUseLiquidityPoolFetching: boolean;
  usdtCurrencyConverter(value: number): number;
  tioxCurrencyConverter(value: number): number;
}

interface IActionProps {
  getTioBalance: typeof actions.getTioLockedBalance;
  getLPAssets: typeof actions.getLPAssets;
  getUseLiquidityPool: typeof actions.getUseLiquidityPool;
  getTotalTio: typeof actions.getTotalTio;
  setConvertationCurrency: typeof actions.setConvertationCurrency;
  setUseLiquidityPool: typeof actions.setUseLiquidityPool;
  setAssetFilter: typeof actions.setAssetFilter;
  makePayout: typeof actions.makePayout;
  postLoanAgreement(request: IPandaDocsRequest): void;
  removeLoanAgreement(): void;
}

interface IDispatchProps {
  setNotification: typeof notificationActions.setNotification;
}

interface IOwnProps {
  verifyCommunication: ICommunication;
  withdrawCoinsCommunication: ICommunication;
  makePayoutCommunication: ICommunication;
  withdrawCoins(request: IWithdrawToLPRequest): void;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IOwnProps & IDispatchProps;

function mapState(state: IAppReduxState): IStateProps {
  const { tiox: userTioBalance = 0 } = userSelectors.selectBalanceDict(state);
  return {
    user: userSelectors.selectUser(state),
    assets: selectors.selectAssets(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
    assetFilter: selectors.selectAssetFilter(state),
    conversionCurrency: selectors.selectConversionCurrency(state),
    convertedTotalTio: selectors.selectConvertedTotalTio(state),
    convertedTioLocked: selectors.selectConvertedTioLocked(state),
    pandaDocUrl: selectors.selectPandaDocUrl(state),
    pandaDocId: selectors.selectPandaDocId(state),
    pandaDocUrlFetching: selectors.selectPandaDocUrlFetching(state),
    tioLocked: selectors.selectTioLocked(state),
    timeValid: selectors.selectTimeValid(state),
    tioPrice: selectors.selectTioPrice(state),
    totalTio: selectors.selectGetTotalTIO(state),
    usdtCurrencyConverter: selectors.selectCurrencyConverter(state, 'usdt'),
    tioxCurrencyConverter: selectors.selectCurrencyConverter(state, 'tiox'),
    useLiquidityPool: selectors.selectCanUseLiquidityPool(state),
    isUseLiquidityPoolFetching: selectors.selectIsUseLiquidityPoolFetching(state),
    userTioBalance,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    getTioBalance: actions.getTioLockedBalance,
    getLPAssets: actions.getLPAssets,
    makePayout: actions.makePayout,
    setConvertationCurrency: actions.setConvertationCurrency,
    setNotification: notificationActions.setNotification,
    setUseLiquidityPool: actions.setUseLiquidityPool,
    getUseLiquidityPool: actions.getUseLiquidityPool,
    setAssetFilter: actions.setAssetFilter,
    getTotalTio: actions.getTotalTio,
    postLoanAgreement: actions.postLoanAgreement,
    removeLoanAgreement: actions.removeLoanAgreement
  }, dispatch);
}

const b = block('liquidity-pool');

class LiquidityPool extends React.PureComponent<IProps> {
  public tioxToLock: number;

  public componentDidMount() {
    const { user, getTotalTio, getLPAssets, getUseLiquidityPool, getTioBalance } = this.props;
    if (user) {
      getTotalTio();
      getUseLiquidityPool();
      getTioBalance(user.id);
      getLPAssets(user.id);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const {
      user,
      getLPAssets,
      getTioBalance,
      verifyCommunication,
      makePayoutCommunication
    } = this.props;

    if (isSuccessedByState(prevProps.verifyCommunication, verifyCommunication) ||
      isSuccessedByState(prevProps.makePayoutCommunication, makePayoutCommunication)) {
      if (user) {
        getLPAssets(user.id);
        getTioBalance(user.id);
      }
    }
  }

  public render() {
    const {
      translate: t, setConvertationCurrency, conversionCurrency,
      tioLocked, tioPrice, userTioBalance, tioxCurrencyConverter,
      convertedTioLocked, convertedTotalTio, usdtCurrencyConverter,
      useLiquidityPool, setUseLiquidityPool, user, timeValid,
      assets, assetsInfo, assetFilter, setAssetFilter, totalTio,
      isUseLiquidityPoolFetching, withdrawCoinsCommunication,
      pandaDocUrl, pandaDocUrlFetching, removeLoanAgreement,
    } = this.props;

    const filteredAssets = filterAssets(assetFilter, assets);
    const isPandaDocOpen = pandaDocUrlFetching || pandaDocUrl;
    const historicalPayouts = sumHistoricalPayouts(assets);

    if (isUseLiquidityPoolFetching) {
      return <Preloader isShow />;
    }

    return (user && useLiquidityPool) ? (
      <div className={b()}>
        <PandaDocModal
          isOpen={!!isPandaDocOpen}
          url={pandaDocUrl}
          onComplete={this.onCompleteDocument}
          onCancel={removeLoanAgreement}
        />
        <TotalPayout
          assetsInfo={assetsInfo}
          conversionCurrency={conversionCurrency}
          setConvertationCurrency={setConvertationCurrency}
          title={t('LIQUIDITYPOOL:TOTAL-PAYOUT:TITLE')}
          usersHistoricalPayouts={historicalPayouts}
        />
        <div className={b('row')()}>
          <TioLockup
            assetsInfo={assetsInfo}
            conversionCurrency={conversionCurrency}
            poolTotalTio={totalTio}
            convertedPoolTotal={convertedTotalTio}
            convertedTioLocked={convertedTioLocked}
            tioLocked={tioLocked}
            timeValid={timeValid}
            userTioBalance={userTioBalance}
            tioxCurrencyConverter={tioxCurrencyConverter}
            onLockBtnClick={this.handleLock}
            onUnlockBtnClick={this.handleUnlock}
            onNotification={this.handleOnNotification}
            isLocking={withdrawCoinsCommunication.isRequesting}
          />
          <Calculator
            assetsInfo={assetsInfo}
            conversionCurrency={conversionCurrency}
            poolTotalTio={totalTio}
            tioPrice={tioPrice}
            usdtCurrencyConverter={usdtCurrencyConverter}
          />
        </div>

        <div className={b('row')()}>
          <AssetsTable
            assetsInfo={assetsInfo}
            assets={filteredAssets}
            assetPayoutType="daily"
            setAssetFilter={setAssetFilter}
            conversionCurrency={conversionCurrency}
            title={t('LIQUIDITYPOOL:ASSETS-TABLE:DAILY')}
          />
          <AssetsTable
            assetsInfo={assetsInfo}
            assets={filteredAssets}
            assetPayoutType="historical"
            setAssetFilter={setAssetFilter}
            conversionCurrency={conversionCurrency}
            title={t('LIQUIDITYPOOL:ASSETS-TABLE:HISTORICAL')}
          />
        </div>
      </div>
    ) : (
        <LPtermsOfService
          setUseLiquidityPool={setUseLiquidityPool}
        />);
  }

  @bind
  private handleLock(amount: number) {
    const { postLoanAgreement, user } = this.props;
    let userAddress = '';
    let userCity = '';
    let userCountry = '';
    let userPostCode = '';

    if (user) {
      userAddress = user ? user.address : '';
      userCity = user ? user.city : '';
      if (user.country) {
        userCountry = user.country.name ? user.country.name : '';
      }
      userPostCode = user.postCode ? user.postCode : '';
    }

    const address = `${userAddress} ${userCity} ${userCountry} ${userPostCode}`;

    if (user) {
      const { firstName, lastName, email } = user;
      this.tioxToLock = amount;

      postLoanAgreement({
        firstName,
        lastName,
        email,
        amount,
        address
      });
    }
  }

  @bind
  private onCompleteDocument() {
    const { pandaDocId, withdrawCoins } = this.props;

    withdrawCoins({
      paymentSystem: 'LiquidityPool',
      transferId: `${transferIdPrefixes.lp}-${uuid()}`,
      assetId: 'tiox',
      amount: this.tioxToLock,
      documentId: pandaDocId
    });

    this.props.removeLoanAgreement();
  }

  @bind
  private handleUnlock(amount: number) {
    const { makePayout } = this.props;

    makePayout({
      paymentSystem: 'LiquidityPool',
      assetId: 'tiox',
      amount
    });
  }

  @bind
  private handleOnNotification(notification: INotification) {
    const { setNotification } = this.props;
    setNotification(notification);
  }
}

const translated = i18nConnect(LiquidityPool);
const connectedToRedux = connect<IStateProps, IActionProps, IOwnProps>(mapState, mapDispatch)(translated);

export default connectedToRedux;
export { LiquidityPool };
