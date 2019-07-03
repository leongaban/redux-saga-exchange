import * as React from 'react';
import { bind } from 'decko';

import { Modal, CoinCell } from 'shared/view/elements';
import { namespace as i18nNS } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';
import { IAssetsInfoMap } from 'shared/types/models';

import { IReduxState } from '../../../namespace';
import { actions } from '../../../redux';
import DepositCoins from '../DepositCoins/DepositCoins';

type IProps = IOwnProps;

interface IOwnProps {
  addressIsLoading: boolean;
  depositCoinsModal: IReduxState['ui']['modals']['depositCoins'];
  assetsInfo: IAssetsInfoMap;
  translate: i18nNS.TranslateFunction;
  setModalProps: typeof actions.setModalProps;
  setNotification: typeof notificationActions.setNotification;
}

class DepositCoinsDialog extends React.PureComponent<IProps> {

  public render() {
    const { translate: t, depositCoinsModal: { isOpen, currencyCode }, addressIsLoading } = this.props;

    return (
      <Modal
        title={t('BALANCE:DEPOSIT-COINS-DIALOG:TITLE')}
        refiningText={currencyCode ? this.renderRefiningText(currencyCode) : ''}
        isOpen={isOpen}
        onClose={this.handleClose}
        hasCloseCross
        hasBotttomBorderAtHeader
      >
        <DepositCoins {...this.props} addressIsLoading={addressIsLoading} />
      </Modal>
    );
  }

  @bind
  private handleClose() {
    this.props.setModalProps({ name: 'depositCoins', props: { address: null, isOpen: false } });
  }

  @bind
  private renderRefiningText(currencyCode: string) {
    const { assetsInfo } = this.props;
    const asset = assetsInfo[currencyCode];
    return asset ? <CoinCell code={currencyCode} iconSrc={asset.imageUrl} /> : null;
  }
}

export default (
  DepositCoinsDialog
);
