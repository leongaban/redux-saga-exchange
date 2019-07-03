import * as React from 'react';
import block from 'bem-cn';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { IForexLinks } from 'shared/types/models';
import { Preloader } from 'shared/view/elements';

import './MT5Widget.scss';

const b = block('info-widget');

interface IOwnProps {
  preloading: boolean;
  mt5Links: IForexLinks;
}

class MT5Widget extends React.PureComponent<IOwnProps & ITranslateProps> {
  public render() {
    const { preloading, mt5Links, translate: t } = this.props;
    const { windows, web, ios, android, fxPlatform, fxPricing } = mt5Links;

    if (preloading) {
      return (<Preloader size={5} isShow />);
    }

    return (
      <div className={b('cell')()}>
        <section className={b('cell-header')()}>
          <h4>{t('FOREX:INFO-WIDGET-TITLE')}</h4>
        </section>

        <section className={b('row')()}>
          <p className={b('full-width')()}>{t('FOREX:INSTALL-LOCATION')} {t('FOREX:PLEASE-USE-CREDENTIALS')}</p>
          <a href={fxPlatform} target="_blank">{fxPlatform}</a>
        </section>

        <section className={b('row')()}>
          <a href={windows} target="_blank">(Windows Client)</a>
          (Mac Client) coming soon.
          <a href={web} target="_blank">(WebTrader)</a>
          <a href={ios} target="_blank">(iOS)</a>
          <a href={android} target="_blank">(Android)</a>
        </section>

        <section className={b('row')()}>
          <p className={b('full-width')()}>{t('FOREX:USE-WIDGETS')}</p>
          <p className={b('full-width')()}>{t('FOREX:COMMISSIONS')}</p>
          <a href={fxPricing} target="_blank">{fxPricing}</a>
        </section>

        <section className={b('row')()}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/_U553-BBmRA"
            frameBorder="0"
            // @ts-ignore: Unreachable code error
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </section>
      </div>
    );
  }
}
export default i18nConnect(MT5Widget);
