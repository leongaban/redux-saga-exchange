import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { actions as notificationActions } from 'services/notification';
import { selectors as userSelectors } from 'services/user';
import { selectors as configSelectors } from 'services/config';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { IWithdrawCoinsModal, IAssetsInfoMap, ISavedWithdrawalAddresses } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { CoinCell } from 'shared/view/elements';

import { actions, selectors } from '../../../redux';
import { WithdrawCoins, MDialogHeader } from '../../components';

interface IStateProps {
  withdrawCoinsModal: IWithdrawCoinsModal;
  withdrawAmount: string | null;
  availableBalance: number | null;
  assetsInfo: IAssetsInfoMap;
  withdrawCoinsCommunication: ICommunication;
  savedWithdrawalAddresses: ISavedWithdrawalAddresses;
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

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({ ...actions, ...notificationActions }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  const { withdrawCoins: { currencyCode } } = selectors.selectModals(state);
  return {
    withdrawCoinsModal: selectors.selectModals(state).withdrawCoins,
    withdrawAmount: selectors.selectWithdrawAmount(state),
    withdrawCoinsCommunication: selectors.selectCommunication(state, 'withdrawCoins'),
    availableBalance: currencyCode ? userSelectors.selectBalanceDict(state)[currencyCode] : null,
    assetsInfo: configSelectors.selectAssetsInfo(state),
    savedWithdrawalAddresses: configSelectors.selectSavedWithdrawalAddresses(state),
  };
}

class MWithdrawCoinsDialog extends React.PureComponent<IProps> {
  public render() {
    const { translate: t, withdrawCoinsModal: { currencyCode } } = this.props;
    return (
      <>
        <MDialogHeader
          title={t('BALANCE:WITHDRAW-COINS-DIALOG:TITLE')}
          subtitle={currencyCode ? this.renderSubtitle(currencyCode) : ''}
        />
        <WithdrawCoins
          {...this.props}
          currencyCode={currencyCode}
          onCancelButtonClick={this.handleCancelButtonClick}
        />
      </>
    );
  }

  @bind
  private handleCancelButtonClick() {
    this.props.setModalProps({
      name: 'withdrawCoins',
      props: { isOpen: false, currencyCode: null },
    });
  }

  @bind
  private renderSubtitle(currencyCode: string) {
    const { assetsInfo } = this.props;
    const asset = assetsInfo[currencyCode];
    return asset ? <CoinCell code={currencyCode} iconSrc={asset.imageUrl} /> : null;
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      MWithdrawCoinsDialog
    )));
