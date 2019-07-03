import * as React from 'react';
import block from 'bem-cn';

import { Icon } from 'shared/view/elements';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import './ThankYouLayout.scss';

const b = block('thank-you-layout');

type IProps = ITranslateProps;

class ThankYouLayout extends React.PureComponent<IProps> {

  public render() {
    const { translate: t } = this.props;

    return (
      <div className={b()}>
        <div className={b('container')()}>
          <Icon src={require('shared/view/images/logo-inline.svg')} className={b('logo')()} />
          <div className={b('heading')()}>
            {t('THANK-YOU:HEADING')}
          </div>
          <div className={b('text')()}>
            {t('THANK-YOU:TEXT')}
          </div>
        </div>
      </div>
    );
  }
}

export default (
  i18nConnect(
    ThankYouLayout
  ));
