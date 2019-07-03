import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as  CopyToClipboard from 'react-copy-to-clipboard';
import { actions as notificationActions } from 'services/notification';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Button, Icon } from 'shared/view/elements';
import { IApiKey } from 'shared/types/models';

import './SecretKeyPanel.scss';

interface IOwnProps {
  details: IApiKey;
  setNotification: typeof notificationActions.setNotification;
  removeSecretKey(publicKey: string): void;
}

type IProps = IOwnProps & ITranslateProps;

const b = block('secret-key-panel');

class SingleApiKey extends React.PureComponent<IProps> {
  public render() {
    const { details, translate: t } = this.props;

    return (
      <div className={b()}>
        <span className={b('api-label')()}>{details.name}</span>
        <div className={b('body')()}>
          <p className={b('paragraph')()}>
            <span className={b('label')()}>
              {t('API-KEYS:LABEL-API-KEY')}:
            </span>
            <span className={b('value')()}>{details.publicKey}</span>
            {this.renderCopyButton(details.publicKey)}
          </p>
          <p className={b('paragraph')()}>
            <span className={b('label')()}>{t('API-KEYS:LABEL-SECRET-KEY')}:</span>
            <span className={b('value')()}>{details.privateKey}</span>
            {details.privateKey && this.renderCopyButton(details.privateKey)}
          </p>
          <p className={b('label')()}>
            {t('API-KEYS:SECRET-KEY-INFO')}
          </p>

          <span className={b('submit')()}>
            <Button onClick={this.onConfirmSecretKey}>{t('SHARED:BUTTONS:OK')}</Button>
          </span>
        </div>
      </div>
    );
  }

  @bind
  private renderCopyButton(textToCopy: string) {
    return (
      <CopyToClipboard
        text={textToCopy}
        onCopy={this.handleCopyToClipboard}
      >
        <span className={b('copy-btn')()}>
          <Button color="blue">
            <Icon
              src={require('./img/copy-icon-inline.svg')}
              className={b('btn-icon')()}
            />
          </Button>
        </span>
      </CopyToClipboard>
    );
  }

  @bind
  private onConfirmSecretKey() {
    this.props.removeSecretKey(this.props.details.publicKey);
  }

  @bind
  private handleCopyToClipboard(text: string, result: boolean) {
    const { setNotification, translate: t } = this.props;
    if (result) {
      setNotification({ kind: 'info', text: t('API-KEYS:COPY-KEY-SUCCESS') });
    } else {
      setNotification({ kind: 'error', text: t('API-KEYS:COPY-KEY-FAILD') });
    }
  }
}

export default i18nConnect(SingleApiKey);
