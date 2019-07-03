import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { ISavedWithdrawalAddresses, IAssetsInfoMap } from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';
import { actions as notificationActions } from 'services/notification';
import { selectors as userSelectors } from 'services/user';
import { selectors as configSelectors } from 'services/config';
import { UITheme } from 'shared/types/ui';

import { selectors, actions } from '../../../redux';
import { IReduxState } from '../../../namespace';
import { DepositCoinsDialog, WithdrawCoinsDialog, SimplexDialog } from '../../components';

interface IStateProps {
  modals: IReduxState['ui']['modals'];
  withdrawAmount: string | null;
  availableBalance: number | null;
  assetsInfo: IAssetsInfoMap;
  withdrawCoinsCommunication: ICommunication;
  loadDepositAddressCommunication: ICommunication;
  savedWithdrawalAddresses: ISavedWithdrawalAddresses;
  uiTheme: UITheme;
}

interface IActionProps {
  setModalProps: typeof actions.setModalProps;
  withdrawCoins: typeof actions.withdrawCoins;
  reset: typeof actions.reset;
  saveWithdrawalAddress: typeof actions.saveWithdrawalAddress;
  deleteWithdrawalAddress: typeof actions.deleteWithdrawalAddress;
  setNotification: typeof notificationActions.setNotification;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  const { withdrawCoins: { currencyCode } } = selectors.selectModals(state);
  return {
    modals: selectors.selectModals(state),
    withdrawAmount: selectors.selectWithdrawAmount(state),
    withdrawCoinsCommunication: selectors.selectCommunication(state, 'withdrawCoins'),
    loadDepositAddressCommunication: selectors.selectCommunication(state, 'loadDepositAddress'),
    availableBalance: currencyCode ? userSelectors.selectBalanceDict(state)[currencyCode] : null,
    assetsInfo: configSelectors.selectAssetsInfo(state),
    savedWithdrawalAddresses: configSelectors.selectSavedWithdrawalAddresses(state),
    uiTheme: configSelectors.selectUITheme(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    ...actions,
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

class Modals extends React.PureComponent<IProps> {

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const {
      modals, translate: t, setModalProps, withdrawAmount, withdrawCoins, setNotification,
      availableBalance, assetsInfo, withdrawCoinsCommunication, savedWithdrawalAddresses, saveWithdrawalAddress,
      deleteWithdrawalAddress, loadDepositAddressCommunication, uiTheme
    } = this.props;

    return (
      <React.Fragment>
        <DepositCoinsDialog
          depositCoinsModal={modals.depositCoins}
          translate={t}
          assetsInfo={assetsInfo}
          setModalProps={setModalProps}
          setNotification={setNotification}
          addressIsLoading={loadDepositAddressCommunication.isRequesting}
        />
        <WithdrawCoinsDialog
          withdrawCoinsModal={modals.withdrawCoins}
          translate={t}
          setModalProps={setModalProps}
          availableBalance={availableBalance}
          withdrawAmount={withdrawAmount}
          withdrawCoins={withdrawCoins}
          assetsInfo={assetsInfo}
          withdrawCoinsCommunication={withdrawCoinsCommunication}
          savedWithdrawalAddresses={savedWithdrawalAddresses}
          saveWithdrawalAddress={saveWithdrawalAddress}
          deleteWithdrawalAddress={deleteWithdrawalAddress}
          setNotification={setNotification}
        />
        <SimplexDialog
          simplexModal={modals.simplex}
          depositModal={modals.depositCoins}
          setModalProps={setModalProps}
          translate={t}
          addressIsLoading={loadDepositAddressCommunication.isRequesting}
          uiTheme={uiTheme}
        />
      </React.Fragment>
    );
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      Modals,
    ),
  )
);
