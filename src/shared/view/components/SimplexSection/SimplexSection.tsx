import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Button, Icon } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import './SimplexSection.scss';

enum SimplexCurrencies {
  BTC,
  ETH,
  LTC,
  BCH
}

const b = block('simplex-section');

interface IOwnProps {
  isIcon?: boolean;
  currency: string;
  openSimplexModal(currency: string): void;
}

type IProps = IOwnProps & ITranslateProps;

class SimplexSection extends React.Component<IProps> {

  public render() {
    let { currency } = this.props;
    const { isIcon, translate: t } = this.props;
    currency = currency.toUpperCase();

    const buttonVisible = currency in SimplexCurrencies;

    return (
      <section className={b()}>
        {!isIcon && buttonVisible && <Button color="text-blue" onClick={this.openSimplexModal}>
          {t('SIMPLEX:BUTTON:TEXT', { currency })}
        </Button>}
        {isIcon && buttonVisible &&
          <a
            href=""
            className={b('link')()}
            onClick={this.openSimplexModal}
            title={t('SIMPLEX:BUTTON:TEXT', { currency })}
          >
            <Icon
              className={b('icon')()}
              src={require('./../../images/ico_credit_card_buy-inline.svg')}
            />
          </a> }
      </section>
    );
  }

  @bind
  private openSimplexModal(event:  React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    this.props.openSimplexModal(this.props.currency);
  }

}

export default i18nConnect(
  SimplexSection
);
