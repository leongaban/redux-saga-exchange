import block from 'bem-cn';
import * as React from 'react';
import { connect } from 'react-redux';

import { IStateProps, IProps, mapState } from '../shared';
import { SSLNotice } from '../../../containers';
import './MAuthLayout.scss';

const b = block('m-auth-layout');

class MAuthLayout extends React.PureComponent<IProps> {

  public render() {
    const { children, navSegmentsComponent, title, disabled } = this.props;

    return (
      <div className={b({ disabled: Boolean(disabled) })()}>
        <div className={b('content-wrapper')()}>
          <SSLNotice className={b('ssl-notice')()} />
          {navSegmentsComponent && <div className={b('segments')()}>{navSegmentsComponent}</div>}
          {title && <h2 className={b('title')()}>{title}</h2>}
          <div className={b('main-content')()}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default connect<IStateProps>(mapState)(MAuthLayout);
