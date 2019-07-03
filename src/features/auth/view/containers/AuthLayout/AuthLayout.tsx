import block from 'bem-cn';
import * as React from 'react';
import { connect } from 'react-redux';

import { Icon } from 'shared/view/elements';

import { IStateProps, IProps, mapState } from './shared';
import { SSLNotice } from '../../containers';

import './AuthLayout.scss';

const b = block('auth-layout');

class AuthLayout extends React.PureComponent<IProps> {

  public render() {
    const { children, navSegmentsComponent, title, disabled } = this.props;

    return (
      <div className={b()}>
        <div className={b('layout', { disabled: Boolean(disabled) })()}>
          <Icon src={require('shared/view//images/logo-inline.svg')} className={b('logo')()} />
          <SSLNotice className={b('ssl-notice')()} />
          {navSegmentsComponent && <div className={b('segments')()}>{navSegmentsComponent}</div>}
          {title && <h2 className={b('title')()}>{title}</h2>}
          <div className={b('content')()}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default connect<IStateProps>(mapState)(AuthLayout);
