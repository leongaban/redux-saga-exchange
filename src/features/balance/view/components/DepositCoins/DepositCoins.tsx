import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';
import * as bchaddr from 'bchaddrjs';

import { Select, Preloader } from 'shared/view/elements';
import { SimplexSection } from 'shared/view/components';
import { transformAssetName } from 'shared/helpers/converters';
import { IDepositAddressData } from 'shared/types/models';
import { namespace as i18nNS } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';

import { AddressSection, QRCodePopup } from '..';
import { IReduxState } from '../../../namespace';
import { actions } from '../../../redux';

import './DepositCoins.scss';

const b = block('deposit-coins');

interface IOwnProps {
  addressIsLoading: boolean;
  depositCoinsModal: IReduxState['ui']['modals']['depositCoins'];
  translate: i18nNS.TranslateFunction;
  setModalProps: typeof actions.setModalProps;
  setNotification: typeof notificationActions.setNotification;
}

type IProps = IOwnProps;

type BchAddressType = 'cash' | 'legacy';

interface IState {
  bchAddressType: BchAddressType;
  currentQR?: string;
}

class DepositCoins extends React.PureComponent<IProps, IState> {

  public state: IState = { bchAddressType: 'cash' };

  private options: BchAddressType[] = ['cash', 'legacy'];

  public render() {
    const { depositCoinsModal: { address, currencyCode }, addressIsLoading } = this.props;

    return (
      <>
        {address !== null && currencyCode !== null &&
          this.renderContent(address, currencyCode)}
        <div className={b('preloader', { 'is-active': addressIsLoading })()}>
          <Preloader position="relative" isShow={addressIsLoading} />
        </div>
      </>
    );
  }

  private renderContent({address: rawAddress, memo }: IDepositAddressData, currencyCode: string) {
    const { translate: t } = this.props;
    const { bchAddressType } = this.state;

    const shouldShowSmartContractWarning = R.contains(
      currencyCode.toLocaleLowerCase(),
      ['eth', 'tio', 'bat', 'zrx', 'omg'],
    );

    const address = currencyCode === 'bch' ? this.convertBchAddress(rawAddress) : rawAddress;
    return (
      <div className={b()}>
        <div className={b('usage-warning-text-and-address')()}>
          <div className={b('usage-warning-text')()}>
            {t('BALANCE:DEPOSIT-COINS-DIALOG:USAGE-WARNING-TEXT', {
              currency: transformAssetName(currencyCode)
            })}
          </div>
          {shouldShowSmartContractWarning && (
            <div className={b('smart-contract-warning-text')()}>
              {t('BALANCE:DEPOSIT-COINS-DIALOG:SMART-CONTRACT-WARNING-TEXT')}
            </div>
          )}
          <div className={b('address')()}>
            {
              currencyCode !== 'bch'
                ? null
                : (
                  <div className={b('bch-address-type')()}>
                    <div className={b('bch-address-type-label')()}>
                      {t('BALANCE:DEPOSIT-COINS-DIALOG:BCH-ADDRESS-TYPE-SELECT-LABEL')}
                    </div>
                    <div className={b('bch-address-type-select')()}>
                      <Select
                        options={this.options}
                        optionValueKey={this.getOptionValue}
                        selectedOption={bchAddressType}
                        onSelect={this.handleBchAddressTypeSelect}
                      />
                    </div>
                  </div>
                )
            }
            <div className={b('simplex-wrapper')()}>
              <SimplexSection currency={currencyCode} openSimplexModal={this.openSimplexModal} />
            </div>
            <AddressSection
              label={t('BALANCE:DEPOSIT-COINS-DIALOG:DEPOSIT-ADDRESS-FIELD-LABEL')}
              data={address}
              copyButtonLabel={t('SHARED:BUTTONS:COPY')}
              qrButtonLabel={t('SHARED:BUTTONS:QR-CODE')}
              setNotification={this.props.setNotification}
              onShowQRCodeClick={this.showQRCode}
            />
            {memo && (
              <>
                <AddressSection
                  label={t('BALANCE:DEPOSIT-COINS-DIALOG:MEMO-FIELD-LABEL')}
                  data={memo}
                  copyButtonLabel={t('SHARED:BUTTONS:COPY')}
                  qrButtonLabel={t('SHARED:BUTTONS:QR-CODE')}
                  setNotification={this.props.setNotification}
                  onShowQRCodeClick={this.showQRCode}
                />
                <div className={b('memo-warning-text')()}>
                  {t('BALANCE:DEPOSIT-COINS-DIALOG:MEMO-WARNING-TEXT')}
                </div>
              </>
            )}
          </div>
        </div>
        {this.state.currentQR && <QRCodePopup data={this.state.currentQR} onClose={this.hideQRCode} translate={t} />}
      </div >
    );
  }

  @bind
  private openSimplexModal(currency: string) {
    this.props.setModalProps({
      name: 'depositCoins',
      props: { isOpen: false },
    });

    this.props.setModalProps({
      name: 'simplex',
      props: { isOpen: true, currency },
    });
  }

  private convertBchAddress(address: string) {
    const { bchAddressType } = this.state;
    return bchAddressType === 'legacy' ? bchaddr.toLegacyAddress(address) : address;
  }

  @bind
  private showQRCode(code: string) {
    this.setState({ currentQR: code });
  }

  @bind
  private hideQRCode() {
    this.setState({ currentQR: undefined });
  }

  private getOptionValue(x: string) {
    return x;
  }

  @bind
  private handleBchAddressTypeSelect(bchAddressType: BchAddressType) {
    this.setState({ bchAddressType });
  }
}

export default (
  DepositCoins
);
