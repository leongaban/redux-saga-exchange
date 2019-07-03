import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { ICommunication } from 'shared/types/redux';
import { IAppReduxState } from 'shared/types/app';
import { isSuccessedByState } from 'shared/helpers/redux';

import { selectors, actions } from '../../../redux';

interface IActionProps {
  logout: typeof actions.logout;
}

interface IStateProps {
  isLogoutFetching: ICommunication;
}

interface IOwnProps {
  isAdminPanel?: boolean;
  onSuccessfullLogout(): void;
}

type IProps = IActionProps & IStateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isLogoutFetching: selectors.selectCommunicationState('logout', state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    logout: actions.logout,
  }, dispatch);
}

class Logout extends React.PureComponent<IProps> {
  public componentWillReceiveProps(nextProps: IProps) {
    const { isLogoutFetching } = this.props;
    if (isSuccessedByState(isLogoutFetching, nextProps.isLogoutFetching)) {
      this.props.onSuccessfullLogout();
    }
  }

  public componentDidMount() {
    const { logout, isAdminPanel } = this.props;
    logout(isAdminPanel);
  }

  public render() {
    return null;
  }
}

export default connect(mapState, mapDispatch)(Logout);
