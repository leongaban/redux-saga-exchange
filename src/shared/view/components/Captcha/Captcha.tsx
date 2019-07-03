import block from 'bem-cn';
import * as React from 'react';
import { bind } from 'decko';
import { captchaSiteKey } from 'config';

import { loadRecaptcha, hideRecaptchaBadge } from './loadRecaptcha';
import './Captcha.scss';

interface IProps {
  action?: 'homepage' | 'login' | 'social' | 'e-commerce';
  onChange(hash: string): void;
}

const b = block('g-recaptcha');

class Captcha extends React.PureComponent<IProps> {

  public componentDidMount() {
    loadRecaptcha(captchaSiteKey, () => {
      window.grecaptcha.ready(() => {
        this.execute();
      });
    });
  }

  public componentWillUnmount() {
    hideRecaptchaBadge();
  }

  public render() {
    return <div className={b()} />;
  }

  @bind
  private execute() {
    const { onChange, action = 'homepage' } = this.props;

    window.grecaptcha.execute(captchaSiteKey, { action })
      .then((token) => {
        onChange(token);
      });
  }
}

export { IProps as ICaptchaProps };
export default Captcha;
