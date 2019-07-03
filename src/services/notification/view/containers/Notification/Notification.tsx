import * as React from 'react';
import { connect } from 'react-redux';
import block from 'bem-cn';

import { Icon } from 'shared/view/elements';
import { IAppReduxState } from 'shared/types/app';
import { INotification } from 'shared/types/ui';

import { selectors } from '../../../redux';
import './Notification.scss';

interface IStateProps {
  notification: INotification | null;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    notification: selectors.selectNotification(state),
  };
}

type IProps = IStateProps;

const b = block('notification');

class Notification extends React.PureComponent<IProps> {

  public render() {
    const { notification } = this.props;
    // const kind = notification ? notification.kind : '';
    return (
      notification && this.renderContent(notification)
    );
  }

  private renderContent(notification: INotification) {
    const { kind, text } = notification;
    return (
      <div className={b({ kind })()}>
        <Icon
          className={b('icon')()}
          src={
            kind === 'info'
              ? require('./img/success-inline.svg')
              : require('./img/error-inline.svg')}
        />
        <div className={b('text')()}>
          {text}
        </div>
      </div>
    );
  }
}

export default (
  connect(mapState, () => ({}))(
    Notification,
  )
);
