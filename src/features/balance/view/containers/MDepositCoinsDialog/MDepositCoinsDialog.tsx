import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { actions as notificationActions } from 'services/notification';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { Button, CoinCell } from 'shared/view/elements';
import { IDepositCoinsModal, IAssetsInfoMap } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';

import { actions, selectors } from '../../../redux';
import { DepositCoins, MDialogHeader } from '../../components';
import './MDepositCoinsDialog.scss';

interface IStateProps {
  depositCoinsModal: IDepositCoinsModal;
  loadDepositAddressCommunication: ICommunication;
  assetsInfo: IAssetsInfoMap;
}

interface IActionProps {
  setModalProps: typeof actions.setModalProps;
  setNotification: typeof notificationActions.setNotification;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({ ...actions, ...notificationActions }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    depositCoinsModal: selectors.selectModals(state).depositCoins,
    loadDepositAddressCommunication: selectors.selectCommunication(state, 'loadDepositAddress'),
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

const b = block('m-deposit-coins-dialog');

class MWithdrawCoinsDialog extends React.PureComponent<IProps> {
  public render() {
    const { translate: t, depositCoinsModal: { currencyCode }, loadDepositAddressCommunication } = this.props;
    return (
      <div className={b()}>
        <div>
          <MDialogHeader
            title={t('BALANCE:DEPOSIT-COINS-DIALOG:TITLE')}
            subtitle={currencyCode ? this.renderSubtitle(currencyCode) : ''}
          />
          <DepositCoins
            {...this.props}
            addressIsLoading={loadDepositAddressCommunication.isRequesting}
          />
        </div>
        <div className={b('buttons')()}>
          <div className={b('button')()}>
            <Button type="button" color="black-white" onClick={this.handleCancelButtonClick}>
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  @bind
  private handleCancelButtonClick() {
    this.props.setModalProps({
      name: 'depositCoins',
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
