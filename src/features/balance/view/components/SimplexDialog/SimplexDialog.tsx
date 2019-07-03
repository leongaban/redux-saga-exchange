import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import queryString from 'query-string';
import { simplexAddress } from 'config';
import { namespace as i18nNS } from 'services/i18n';

import { Modal, Preloader } from 'shared/view/elements';
import { IDepositAddressData } from 'shared/types/models';
import { UITheme } from 'shared/types/ui';

import { IReduxState } from '../../../namespace';
import { actions } from '../../../redux';

import './SimplexDialog.scss';

interface IProps {
  addressIsLoading: boolean;
  depositModal: IReduxState['ui']['modals']['depositCoins'];
  simplexModal: IReduxState['ui']['modals']['simplex'];
  setModalProps: typeof actions.setModalProps;
  translate: i18nNS.TranslateFunction;
  uiTheme: UITheme;
}

interface IState {
  iframeLoading: boolean;
}

const b = block('simplex-dialog');

class SimplexDialog extends React.PureComponent<IProps, IState> {

  public state: IState = {
    iframeLoading: true
  };

  constructor(props: IProps) {
    super(props);
    window.addEventListener('message', this.receiveMessage);
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  }

  public render() {
    const {
      translate: t,
      simplexModal: { isOpen, currency },
      depositModal: { address },
      uiTheme, addressIsLoading } = this.props;
    const { iframeLoading } = this.state;

    return (
        <Modal
          title={t('SIMPLEX:DIALOG:HEADER')}
          isOpen={isOpen}
          onClose={this.closeModal}
          hasCloseCross
          hasBotttomBorderAtHeader
          className={b()}
        >
          <div className={b('wrapper')()}>
            <Preloader isShow={addressIsLoading || iframeLoading} size={4} />
            {!addressIsLoading &&
              <iframe onLoad={this.iframeLoaded} src={this.createUrl(address, currency, uiTheme)} />}
          </div>
        </Modal>
      );
  }

  private receiveMessage(event: MessageEvent) {
    if (event.data.type === 'REDIRECT') {
      window.location = event.data.url;
    }
  }

  private createUrl(addressObj: IDepositAddressData | null, currency: string | null, uiTheme: UITheme) {
    const params = {
      address: addressObj && addressObj.address,
      currency,
      type: 'embed',
      theme: uiTheme
    };

    return `${simplexAddress}?${queryString.stringify(params)}`;
  }

  @bind
  private closeModal() {
    this.props.setModalProps({
      name: 'simplex',
      props: { isOpen: false },
    });
  }

  @bind
  private iframeLoaded() {
    this.setState({
      iframeLoading: false
    });
  }

}

export default SimplexDialog;
