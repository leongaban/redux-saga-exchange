import * as React from 'react';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import block from 'bem-cn';
import { bind } from 'decko';

import { INotification } from 'shared/types/ui';
import { Button, Input, Preloader } from 'shared/view/elements';
import { floorFloatToFixed } from 'shared/helpers/number';

import './WithdrawWidget.scss';

interface IProps {
  baseAsset: string;
  freeMargin: number;
  isWithdrawing: boolean;
  preloading: boolean;
  userBalance: string | number;
  onWithdrawBtnClick(amount: number): void;
  onNotification(notification: INotification): void;
}

interface IState {
  userWithdrawingAmount: string;
}

const b = block('transaction-widget');

class WithdrawWidget extends React.PureComponent<IProps & ITranslateProps, IState> {
  public state: IState = {
    userWithdrawingAmount: '',
  };

  public render() {
    const {
      baseAsset,
      freeMargin,
      isWithdrawing,
      preloading,
      userBalance,
      translate: t,
    } = this.props;

    const { userWithdrawingAmount } = this.state;
    const loadedBalance = baseAsset !== 'none';
    const formattedFreeMargin = floorFloatToFixed(Number(freeMargin), 8);
    const formattedUserBalance = floorFloatToFixed(Number(userBalance), 8);

    if (preloading) {
      return (<Preloader size={5} isShow />);
    }

    return (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4>{t('FOREX:WITHDRAW')} {loadedBalance ? baseAsset : ' '} {t('FOREX:FROM-MT5')}</h4>
        </section>
        <section className={b('row')()}>
          <div className={b('fx-stat-col')()}>
            <p>{t('FOREX:BALANCE-MT5-AVAILABLE')}</p>
            <strong className={b('fx-stat')()}>
              {!loadedBalance ? '' : formattedFreeMargin}
            </strong>
          </div>
          <div className={b('fx-stat-col')()}>
            <p>{t('FOREX:BALANCE-TOTAL')}</p>
            <strong className={b('fx-stat')()}>
              {!loadedBalance ? '' : formattedUserBalance}
            </strong>
          </div>
        </section>

        <section className={b('row')()}>
          <p>{t('FOREX:WITHDRAW-ANY')}</p>
        </section>

        <section className={b('row')()}>
          <div className={b('amount-input')()}>
            <Input
              type="number"
              extent="middle"
              placeholder="0"
              value={userWithdrawingAmount}
              onChange={this.handleWithdrawValueChange}
            />
          </div>
        </section>
        <section className={b('row', { 'lock-button': true })()}>
          <Button
            size="large"
            color="text-blue"
            onClick={this.handleWithdrawActivated}
            isShowPreloader={isWithdrawing}
          >
            {t('FOREX:WITHDRAW')}
          </Button>
        </section>
      </div>
    );
  }

  @bind
  private handleWithdrawActivated() {
    const { onWithdrawBtnClick, onNotification, translate: t, userBalance } = this.props;
    const { userWithdrawingAmount } = this.state;
    const availableToWithdraw = userBalance;

    if (Number(userWithdrawingAmount) === 0) {
      return onNotification({
        kind: 'error',
        text: t('FOREX:ERROR:CANNOT-WITHDRAW-0')
      });
    }

    if (userWithdrawingAmount <= availableToWithdraw) {
      return onWithdrawBtnClick(Number(userWithdrawingAmount));
    }
    else {
      return onNotification({
        kind: 'error',
        text: t('FOREX:WITHDRAW-MORE-BALANCE')
      });
    }
  }
  @bind
  private handleWithdrawValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newWithdrawValue = event.target.value;
    this.setState(() => ({
      userWithdrawingAmount: newWithdrawValue
    }));
  }
}
export default i18nConnect(WithdrawWidget);
