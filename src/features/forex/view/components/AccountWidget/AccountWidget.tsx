import * as React from 'react';
import block from 'bem-cn';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Preloader } from 'shared/view/elements';
import { transformAssetName } from 'shared/helpers/converters';

import './AccountWidget.scss';

interface IProps {
  mt5LoginId: number;
  asset: string;
  balance: number;
  credit: number;
  leverage: number;
  equity: number;
  exchangeRate: number;
  floating: number;
  freeMargin: number;
  margin: number;
  marginLevel: number;
  preloading: boolean;
  profit: number;
}

const b = block('account-widget');

type IOwnProps = IProps & ITranslateProps;

const renderRow = (name: string, value: string | number) => {
  return (
    <div className={b('table-row')()} key={name}>
      <div className={b('info-name')()}><p>{name}</p></div>
      <div><strong>{value}</strong></div>
    </div>
  );
};

class AccountWidget extends React.PureComponent<IOwnProps> {
  public render() {
    const {
      asset, balance, leverage, credit, equity, exchangeRate, floating,
      freeMargin, preloading, margin, marginLevel, mt5LoginId, profit, translate: t
    } = this.props;

    const leftColumn = [
      { name: t('FOREX:BASE-ASSET'), value: transformAssetName(asset) },
      { name: t('FOREX:EXCHANGE-RATE'), value: exchangeRate },
      { name: t('WIDGETS:BALANCE-WIDGET-NAME'), value: balance },
      { name: t('FOREX:LEVERAGE'), value: leverage },
      { name: t('FOREX:CREDIT'), value: credit },
      { name: t('FOREX:EQUITY'), value: equity }
    ];

    const rightColumn = [
      { name: t('FOREX:FREE-MARGIN'), value: freeMargin },
      { name: t('FOREX:MARGIN'), value: margin },
      { name: t('FOREX:MARGIN-LEVEL'), value: marginLevel },
      { name: t('FOREX:FLOATING'), value: floating },
      { name: t('FOREX:PROFIT'), value: profit }
    ];

    if (preloading) {
      return (<Preloader size={5} isShow />);
    }

    return (
      <section className={b('row')()}>
        <section className={b('row-header')()}>
          <h4>{t('FOREX:ACOUNT-INFORMATION')}</h4>
          <strong className={b('login-id')()}>{t('FOREX:LOGIN-ID')} {mt5LoginId}</strong>
        </section>
        <section className={b('cell')()}>
          <div className={b('table')()}>
            {leftColumn.map((data) => renderRow(data.name, data.value))}
          </div>
        </section>
        <section className={b('cell')()}>
          <div className={b('table')()}>
            {rightColumn.map((data) => renderRow(data.name, data.value))}
          </div>
        </section>
      </section>
    );
  }
}
export default i18nConnect(AccountWidget);
