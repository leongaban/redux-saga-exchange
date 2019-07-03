import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { INotification } from 'shared/types/ui';
import { Button, Input, Preloader } from 'shared/view/elements';
import { transformAssetName } from 'shared/helpers/converters';
import { floorFloatToFixed } from 'shared/helpers/number';

import './DepositWidget.scss';

interface IOwnProps {
  baseAsset: string;
  exchangePrice: number;
  leverage: number;
  preloading: boolean;
  isWithdrawing: boolean;
  userAmountWithdrawn: number;
  userBalance: string | number;
  onDepositBtnClick(amount: number): void;
  onNotification(notification: INotification): void;
}

interface IState {
  userDepositAmount: string;
}

const b = block('transaction-widget');

type IProps = IOwnProps & ITranslateProps;

class DepositWidget extends React.PureComponent<IProps, IState> {
  public state: IState = {
    userDepositAmount: '',
  };

  public render() {
    const { baseAsset, leverage, isWithdrawing, preloading, userBalance, translate: t } = this.props;
    const { userDepositAmount } = this.state;
    const enableSubmit = userDepositAmount && Number(userDepositAmount) > 0;
    const loadedBalance = baseAsset !== 'none';
    const assetUppercased = baseAsset ? transformAssetName(baseAsset) : '';
    const leverageValue = `${leverage}:1`;
    const formattedUserBalance = floorFloatToFixed(Number(userBalance), 8);

    if (preloading) {
      return (<Preloader size={5} isShow />);
    }

    return (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4>{t('FOREX:DEPOSIT')} {loadedBalance ? baseAsset : ' '} {t('FOREX:INTO-MT5')}</h4>
        </section>

        <section className={b('row')()}>
          <div className={b('fx-stat-col')()}>
            <p>{t('FOREX:BALANCE-AVAILABLE')}</p>
            <strong className={b('fx-stat')()}>{!loadedBalance ? '' : formattedUserBalance}</strong>
          </div>
          <div className={b('fx-stat-col')()}>
            <p>{t('FOREX:BASE-ASSET')}</p>
            <strong className={b('fx-stat')()}>{!loadedBalance ? '' : assetUppercased}</strong>
          </div>
          <div className={b('fx-stat-col')()}>
            <p>{t('FOREX:LEVERAGE')}</p>
            <strong className={b('fx-stat')()}>{!loadedBalance ? '' : leverageValue}</strong>
          </div>
        </section>

        <section className={b('row')()}>
          <p>{t('FOREX:MIN-DEPOSIT-25')}</p>
        </section>

        <section className={b('row')()}>
          <div className={b('amount-input')()}>
            <Input
              type="number"
              extent="middle"
              placeholder="0"
              value={userDepositAmount}
              onChange={this.handleDepositValueChange}
            />
          </div>
        </section>
        <section className={b('row')()}>
          <Button
            size="large"
            color="text-blue"
            disabled={!enableSubmit}
            onClick={this.handleDepositSubmit}
            isShowPreloader={isWithdrawing}
          >
            {t('FOREX:DEPOSIT')}
          </Button>
        </section>
      </div>
    );
  }

  @bind
  private handleDepositSubmit() {
    const {
      exchangePrice, onDepositBtnClick,
      userBalance, onNotification, translate: t,
    } = this.props;
    const { userDepositAmount } = this.state;
    const availableToDeposit = userBalance;

    if (userDepositAmount <= availableToDeposit) {
      const usdtValue = +userDepositAmount * exchangePrice;

      if (usdtValue < 25) {
        return onNotification({
          kind: 'error',
          text: t('FOREX:ERROR:DEPOSIT-MIN-25')
        });
      }

      return onDepositBtnClick(Number(userDepositAmount));
    }

    if (Number(userDepositAmount) === 0) {
      return onNotification({
        kind: 'error',
        text: t('FOREX:ERROR:CANNOT-DEPOSIT-0')
      });
    }

    if (userDepositAmount > availableToDeposit) {
      return onNotification({
        kind: 'error',
        text: t('FOREX:ERROR:DEPOSIT-MORE-THAN-BALANCE')
      });
    }
  }

  @bind
  private handleDepositValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newDepositValue = event.target.value;
    this.setState(() => ({
      userDepositAmount: newDepositValue
    }));
  }
}
export default i18nConnect(DepositWidget);
