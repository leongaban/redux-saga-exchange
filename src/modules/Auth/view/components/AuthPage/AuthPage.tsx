import block from 'bem-cn';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import './AuthPage.scss';

const b = block('auth-page');

type IProps = RouteComponentProps<{}>;

class AuthPage extends React.PureComponent<IProps> {

  public render() {
    const { children } = this.props;

    return (
      <div className={b()}>
        {children}
      </div>
    );
  }
}

export default withRouter(AuthPage);
