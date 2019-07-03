import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Button, Checkbox, Link } from 'shared/view/elements';
import { IApiKey } from 'shared/types/models';

import './SingleApiKey.scss';

interface IOwnProps {
  details: IApiKey;
  removeApiKey(publicKey: string): void;
}

interface IState {
  isShownIPList: boolean;
}

type IProps = IOwnProps & ITranslateProps;

const b = block('single-api-key');

class SingleApiKey extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isShownIPList: false
  };

  public render() {
    const { details: {
      name,
      publicKey,
      isReadAccess,
      isTrading,
      isWithdrawal,
    }} = this.props;

    return (
      <li className={b()}>
        <div className={b('main')()}>
          <span className={b('api-label')()}>{`${name}:`}</span>
          <span className={b('api-key')()}>{publicKey}</span>
          <div className={b('button')()}>
            <Button onClick={this.handleRemove} iconKind="trash" color="red" />
          </div>
        </div>
        <div className={b('details')()}>
          {this.renderCheckbox('API-KEYS:CHEKBOXES-READ', isReadAccess)}
          {this.renderCheckbox('API-KEYS:CHEKBOXES-TRADING', isTrading)}
          {this.renderCheckbox('API-KEYS:CHEKBOXES-WITHDRAWALS', isWithdrawal)}
          {this.renderIPList()}
        </div>
      </li>
    );
  }

  @bind
  private toggleShownIpList() {
    this.setState(
      (prevState: IState) => ({ isShownIPList: !prevState.isShownIPList })
    );
  }

  private renderIPList() {
    const { translate: t, details } = this.props;
    const { isWithdrawal, ipAddressList } = details;

    if (!isWithdrawal) {
      return null;
    } else if (ipAddressList.length === 0) {
      return (
        <p className={b('ip-list-title')()}>
          {t('API-KEYS:NOT-IP-RESTRICTION')}
        </p>
      );
    }

    return (
      <>
        <Link
          className={b('ip-list-title')()}
          onClick={this.toggleShownIpList}
        >
          {t(
            this.state.isShownIPList ?
            'API-KEYS:HIDE-IP-RESTRICTION-LIST' :
            'API-KEYS:SHOW-IP-RESTRICTION-LIST'
          )}
        </Link>
        {this.state.isShownIPList && <ul className={b('ip-list')()}>
          {ipAddressList.map((address, index) => (
            <li key={index} className={b('ip-list-item ')()}>{address}</li>
          ))}
        </ul>}
      </>
    );
  }

  private renderCheckbox(label: string, value: boolean) {
    const { translate: t } = this.props;
    return (
      <span className={b('checkbox')()}>
        <Checkbox
          disabled
          checked={value}
          label={t(label)}
        />
      </span>
    );
  }

  @bind
  private handleRemove() {
    const { removeApiKey, details } = this.props;
    removeApiKey(details.publicKey);
  }
}

export default i18nConnect(SingleApiKey);
