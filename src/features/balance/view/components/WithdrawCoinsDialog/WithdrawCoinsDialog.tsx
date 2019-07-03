import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { Modal, CoinCell } from 'shared/view/elements';
import { IWithdrawToWalletRequest } from 'shared/types/requests';
import { namespace as i18nNS } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';
import { IAssetsInfoMap, ISavedWithdrawalAddresses } from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';

import { actions } from '../../../redux';
import { IReduxState } from '../../../namespace';
import WithdrawCoins from '../WithdrawCoins/WithdrawCoins';
import './WithdrawCoinsDialog.scss';

interface IOwnProps {
  withdrawCoinsModal: IReduxState['ui']['modals']['withdrawCoins'];
  translate: i18nNS.TranslateFunction;
  setModalProps: typeof actions.setModalProps;
  saveWithdrawalAddress: typeof actions.saveWithdrawalAddress;
  deleteWithdrawalAddress: typeof actions.deleteWithdrawalAddress;
  setNotification: typeof notificationActions.setNotification;
  availableBalance: number | null;
  withdrawAmount: string | null;
  assetsInfo: IAssetsInfoMap;
  withdrawCoinsCommunication: ICommunication;
  savedWithdrawalAddresses: ISavedWithdrawalAddresses;
  withdrawCoins(request: IWithdrawToWalletRequest): void;
}

type IProps = IOwnProps;

const b = block('withdraw-coins-dialog');

class WithdrawCoinsDialog extends React.PureComponent<IProps> {

  public render() {
    const { translate: t, withdrawCoinsModal: { isOpen, currencyCode } } = this.props;

    return currencyCode
      ? (
        <Modal
          title={t('BALANCE:WITHDRAW-COINS-DIALOG:TITLE')}
          refiningText={this.renderRefiningText(currencyCode)}
          isOpen={isOpen}
          onClose={this.closeModal}
          hasCloseCross
          hasBotttomBorderAtHeader
        >
          <div className={b()}>
            <WithdrawCoins
              {...this.props}
              currencyCode={currencyCode}
              onCancelButtonClick={this.closeModal}
            />
          </div>
        </Modal>
      )
      : null;
  }

  @bind
  private closeModal() {
    this.props.setModalProps({
      name: 'withdrawCoins',
      props: { currencyCode: null, isOpen: false },
    });
  }

  @bind
  private renderRefiningText(currencyCode: string) {
    const { assetsInfo } = this.props;
    const asset = assetsInfo[currencyCode];
    return asset ? <CoinCell code={currencyCode} iconSrc={asset.imageUrl} /> : null;
  }
}

export default (
  WithdrawCoinsDialog
);
