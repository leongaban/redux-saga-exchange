import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IAssetsInfoMap } from 'shared/types/models';
import { INotification } from 'shared/types/ui';
import { Button, Icon, Input, Tooltip } from 'shared/view/elements';

import { formatDecimalIfLarge } from 'shared/helpers/number';
import { calculatePoolPercentage, getTierValue, formatMoney } from 'shared/helpers/liquidityPool';
import './TioLockup.scss';

interface IProps {
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  convertedPoolTotal: number;
  convertedTioLocked: number;
  poolTotalTio: number;
  tioLocked: number;
  timeValid: boolean;
  userTioBalance: number;
  isLocking: boolean;
  onLockBtnClick(amount: number): void;
  onUnlockBtnClick(amount: number): void;
  onNotification(notification: INotification): void;
  tioxCurrencyConverter(value: number): number;
}

interface IState {
  confirmUnlock: boolean;
  lockable: boolean;
  unlockable: boolean;
  usersLockedTIO: number;
  usersUnlockedTIO: number;
}

type IOwnProps = IProps & ITranslateProps;

const b = block('tio-lockup');

class TioLockup extends React.PureComponent<IOwnProps, IState> {

  public state: IState = {
    confirmUnlock: false,
    lockable: false,
    unlockable: false,
    usersLockedTIO: 0,
    usersUnlockedTIO: 0,
  };

  private get totalTio() {
    const { tioLocked, userTioBalance } = this.props;
    return tioLocked + userTioBalance;
  }

  public componentDidUpdate(prevProps: IProps) {
    const { tioLocked } = prevProps;
    const { usersLockedTIO, usersUnlockedTIO } = this.state;
    this.checkLockState(usersLockedTIO, tioLocked);
    this.checkUnlockState(usersUnlockedTIO, tioLocked);
  }

  public render() {
    const {
      assetsInfo, convertedPoolTotal, convertedTioLocked, conversionCurrency: currency,
      poolTotalTio, tioLocked, tioxCurrencyConverter, userTioBalance, timeValid,
      translate: t, isLocking,
    } = this.props;

    const { confirmUnlock, lockable, usersLockedTIO, usersUnlockedTIO } = this.state;

    const statClass = b('lp-stat')();
    const convertedTotalTio = tioxCurrencyConverter(this.totalTio);

    return (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4>{t('LIQUIDITYPOOL:TIO-LOCKUP')}</h4>
        </section>

        <section className={b('row')()}>
          <div className={b('lp-stat-col')()}>
            <p>{t('LIQUIDITYPOOL:TIO-LOCKUP:POOL-TOTAL')}</p>
            <strong className={statClass}>
              <Tooltip text={formatMoney(convertedPoolTotal, currency, assetsInfo)} position="bottom">
                <Icon className={b('help-icon')()} src={require('./img/help-inline.svg')} />
                {formatDecimalIfLarge(poolTotalTio)}
              </Tooltip>
            </strong>
          </div>
          <div>
            <p>{t('LIQUIDITYPOOL:TIO-LOCKUP:PERCENT-POOL')}</p>
            <strong className={statClass}>
              {calculatePoolPercentage(poolTotalTio, tioLocked)}
            </strong>
          </div>
          <div>
            <p>{t('LIQUIDITYPOOL:TIO-LOCKUP:EXCHANGE-BALANCE')}</p>
            <strong className={statClass}>
              <Tooltip text={formatMoney(convertedTotalTio, currency, assetsInfo)} position="bottom">
                <Icon className={b('help-icon')()} src={require('./img/help-inline.svg')} />
                {formatDecimalIfLarge(Math.floor(this.totalTio))}
              </Tooltip>
            </strong>
          </div>
          <div className={b('lp-stat-col')()}>
            <p>{t('LIQUIDITYPOOL:TIO-LOCKUP:LOCKED-TIOX')}</p>
            <strong className={statClass}>
              <Tooltip text={formatMoney(convertedTioLocked, currency, assetsInfo)} position="bottom">
                <Icon className={b('help-icon')()} src={require('./img/help-inline.svg')} />
                {formatDecimalIfLarge(tioLocked)}
              </Tooltip>
            </strong>
          </div>
          <div>
            <p>{tioLocked > 0 ? 'Tier' : 'No Tier'}</p>
            <strong className={statClass}>{this.getTier()}</strong>
          </div>
        </section>

        <section className={b('row')()}>
          <div className={b('locked-input')()}>
            {this.renderMin2500()}
            <Input
              unit={t('LIQUIDITYPOOL:TIO-LOCKUP:LOCK')}
              type="text"
              extent="middle"
              onChange={this.handleLockChange}
              value={usersLockedTIO}
            />
          </div>
          <div className={b('users-balance')()}>
            <span>{Math.floor(userTioBalance)}</span>
            <div className={b('view-desktop')()}>
              <span className={b('input_description')()}>{t('LIQUIDITYPOOL:TIO-LOCKUP:AVAILABLE-LOCK')}</span>
            </div>
          </div>
        </section>
        <section className={b('row', { 'lock-button': true })()}>
          <Button
            size="large"
            color="text-blue"
            onClick={this.handleLockActivated}
            isShowPreloader={isLocking}
            disabled={!lockable}
          >
            {t('LIQUIDITYPOOL:TIO-LOCKUP:LOCK')}
          </Button>
        </section>

        <section className={b('row')()}>
          <div className={b('locked-input')()}>
            <Input
              unit={t('LIQUIDITYPOOL:TIO-LOCKUP:UNLOCK')}
              type="text"
              extent="middle"
              disabled={tioLocked === 0 || !timeValid}
              onChange={this.handleUnlockChange}
              value={usersUnlockedTIO}
            />
          </div>
          <div className={b('users-balance')()}>
            <span>{tioLocked}</span>
            <div className={b('view-desktop')()}>
              <span className={b('input_description')()}>{t('LIQUIDITYPOOL:TIO-LOCKUP:AVAILABLE-UNLOCK')}</span>
            </div>
          </div>
        </section>
        {confirmUnlock ? this.displayConfirmUnlock() : this.displayUnlockButton()}
      </div>
    );
  }

  @bind
  private getTier() {
    const { tioLocked } = this.props;
    return tioLocked > 0 ? getTierValue(tioLocked) : null;
  }

  @bind
  private renderMin2500() {
    const { tioLocked, translate: t } = this.props;
    return tioLocked === 0
      ? (<span className={b('min-lock-copy')()}>{t('LIQUIDITYPOOL:TIO-LOCKUP:MIN-2500')}</span>)
      : null;
  }

  @bind
  private checkLockState(newLockedTio: number, lockedTio: number) {
    // First time Locking TIOx into pool.
    if (lockedTio === 0) {
      if (newLockedTio >= 2500) {
        this.setState(() => ({ lockable: true }));
      }
      else {
        this.setState(() => ({ lockable: false }));
      }
    }
    // Locking additional TIOx into pool.
    else if (lockedTio >= 2500) {
      this.setState(() => ({ lockable: true }));
    }
  }

  @bind
  private checkUnlockState(newUnlockedTio: number, lockedTio: number) {
    if (this.props.timeValid) {
      if (newUnlockedTio <= lockedTio) {
        const difference = lockedTio - newUnlockedTio;
        if (lockedTio >= 2500 && difference >= 2500) {
          this.setState(() => ({ unlockable: true }));
        }
        else if (newUnlockedTio === lockedTio) {
          this.setState(() => ({ unlockable: true }));
        }
        else {
          this.setState(() => ({ unlockable: false }));
        }
      }
      else {
        this.setState(() => ({ unlockable: false }));
      }
    }
  }

  @bind
  private handleLockChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newLockValue = Number(event.target.value);

    if (!isNaN(newLockValue)) {
      if (this.totalTio >= 2500) {
        if (newLockValue >= 0) {
          this.setState(() => ({
            lockable: true,
            usersLockedTIO: newLockValue
          }));
        }
      }
      else if (this.totalTio < 2500) {
        this.setState(() => ({ lockable: false }));
      }
    }
  }

  @bind
  private handleUnlockChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const { onNotification, timeValid, translate: t } = this.props;
    const newUnlockValue = Number(event.target.value);

    if (!isNaN(newUnlockValue)) {
      if (timeValid) {
        this.setState(() => ({
          unlockable: true,
          usersUnlockedTIO: newUnlockValue
        }));
      }
      else {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:CANNOT-UNLOCK')
        });
      }
    }
  }

  @bind
  private handleLockActivated() {
    const { onLockBtnClick, onNotification, tioLocked, userTioBalance, translate: t } = this.props;
    const { usersLockedTIO, lockable } = this.state;

    if (lockable) {
      if (usersLockedTIO === 0) {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:CANNOT-LOCK-0')
        });
      }
      // User has 0 locked TIOx.
      if (tioLocked === 0 && usersLockedTIO >= 2500) {
        if (usersLockedTIO <= userTioBalance) {
          return onLockBtnClick(usersLockedTIO);
        }
        else if (usersLockedTIO > userTioBalance) {
          return onNotification({
            kind: 'error',
            text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:LOCK-MORE-THAN-BALANCE')
          });
        }
      }
      else if (tioLocked === 0 && usersLockedTIO < 2500) {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:LOCK-LESS-2500')
        });
      }
      // User has locked TIOx.
      if (tioLocked < this.totalTio) {
        if (usersLockedTIO <= userTioBalance) {
          return onLockBtnClick(usersLockedTIO);
        }
        else if (usersLockedTIO > userTioBalance) {
          return onNotification({
            kind: 'error',
            text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:LOCK-MORE-THAN-BALANCE')
          });
        }
      }
    }
  }

  @bind
  private handleUnlockActivated() {
    const { onUnlockBtnClick, onNotification, timeValid, tioLocked, translate: t } = this.props;
    const { usersUnlockedTIO, unlockable } = this.state;
    const difference = tioLocked - usersUnlockedTIO;
    this.setState(() => ({ unlockable: false, confirmUnlock: false }));

    if (unlockable && timeValid) {
      if (usersUnlockedTIO === 0) {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:CANNOT-UNLOCK-0')
        });
      }
      // User has > 2500 TIOx locked.
      if (tioLocked >= 2500 && usersUnlockedTIO >= 2500) {
        if (usersUnlockedTIO <= tioLocked) {
          return onUnlockBtnClick(usersUnlockedTIO);
        }
        else if (usersUnlockedTIO > tioLocked) {
          return onNotification({
            kind: 'error',
            text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:UNLOCK-MORE-THAN-BALANCE')
          });
        }
      }
      // User has exactly 2500 locked.
      else if (tioLocked === 2500 && usersUnlockedTIO === 2500) {
        return onUnlockBtnClick(usersUnlockedTIO);
      }
      // User is unlocking < 2500, but the locked difference left is >= 2500.
      else if (tioLocked >= 2500 && usersUnlockedTIO < 2500 && difference >= 2500) {
        return onUnlockBtnClick(usersUnlockedTIO);
      }
      // This should never be hit, but is here just in case.
      else if (tioLocked >= 2500 && usersUnlockedTIO < 2500 && difference < 2500) {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:LESS-2500')
        });
      }
      else if (tioLocked === 2500 && usersUnlockedTIO < 2500) {
        return onNotification({
          kind: 'error',
          text: t('LIQUIDITYPOOL:TIO-LOCKUP:ERROR:UNLOCK-LESS-2500')
        });
      }
    }
  }

  @bind
  private displayUnlockButton() {
    const { tioLocked, translate: t } = this.props;
    const { unlockable } = this.state;

    return (
      <section className={b('row', { 'lock-button': true })()}>
        <Button
          size="large"
          color="text-blue"
          onClick={this.handleDisplayConfirmUnlock}
          disabled={!unlockable || tioLocked === 0}
        >
          {t('LIQUIDITYPOOL:TIO-LOCKUP:UNLOCK')}
        </Button>
      </section>
    );
  }

  @bind
  private displayConfirmUnlock() {
    const { translate: t } = this.props;
    return (
      <section className={b('row', { 'lock-button': true })()}>
        <div className={b('confirm-unlock')()}>
          <div className={b('confirm-button')()}>
            <Button
              size="large"
              color="text-blue"
              onClick={this.handleCancelUnlock}
            >
              {t('LIQUIDITYPOOL:TIO-LOCKUP:CANCEL-UNLOCK')}
            </Button>
          </div>

          <div className={b('confirm-button')()}>
            <Button
              size="large"
              color="text-blue"
              onClick={this.handleUnlockActivated}
            >
              {t('LIQUIDITYPOOL:TIO-LOCKUP:CONFIRM-UNLOCK')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  @bind
  private handleDisplayConfirmUnlock() {
    this.setState(() => ({ confirmUnlock: true }));
  }

  @bind
  private handleCancelUnlock() {
    this.setState(() => ({ confirmUnlock: false }));
  }
}

export default (i18nConnect(TioLockup));
