import React from 'react';
import { bind } from 'decko';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { isSuccessedByState } from 'shared/helpers/redux';
import { ICommunication } from 'shared/types/redux';
import { IConfirmEmailInfo } from 'shared/types/models';
import { ErrorScreen } from 'shared/view/components';

import { actions, selectors } from '../../../redux';

interface IDispatchProps {
  confirmEmail: typeof actions.confirmEmail;
  resendConfirmationEmail: typeof actions.resendConfirmationEmail;
  setIsTokenInvalid: typeof actions.setIsTokenInvalid;
}

interface IStateProps {
  isConfirmEmailFetching: ICommunication;
  isTokenInvalid: boolean;
}

interface IOwnProps {
  confirmEmailInfo: IConfirmEmailInfo;
  onSuccessfulConfirm(): void;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isConfirmEmailFetching: selectors.selectCommunicationState('confirmEmail', state),
    isTokenInvalid: selectors.selectIsTokenInvalid(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    confirmEmail: actions.confirmEmail,
    resendConfirmationEmail: actions.resendConfirmationEmail,
    setIsTokenInvalid: actions.setIsTokenInvalid,
  }, dispatch);
}

class ConfirmEmail extends React.PureComponent<IProps> {

  public componentDidMount() {
    this.handleConfirmEmail();
  }

  public componentWillReceiveProps({ isConfirmEmailFetching }: IProps) {
    if (isSuccessedByState(this.props.isConfirmEmailFetching, isConfirmEmailFetching)) {
      this.props.onSuccessfulConfirm();
    }
  }

  public render() {
    const { isConfirmEmailFetching: { error }, isTokenInvalid } = this.props;

    const buttonName = (() => {
      if (isTokenInvalid) {
        return 'RESEND CONFIRMATION EMAIL';
      }
    })();
    const hasError = Boolean(error);
    if (hasError) {
      return (
        <ErrorScreen
          withIcon
          title="Error"
          message={error}
          buttonName={buttonName}
          onButtonClick={this.handleConfirmEmail}
        />
      );
    }
    return null;
  }

  @bind
  private handleConfirmEmail() {
    const {
      confirmEmailInfo, resendConfirmationEmail, confirmEmail, isTokenInvalid,
    } = this.props;
    if (confirmEmailInfo.email && isTokenInvalid) {
      resendConfirmationEmail(confirmEmailInfo.email);
    } else {
      confirmEmail(confirmEmailInfo);
    }
  }
}

export { IProps, ConfirmEmail };
export default connect(mapState, mapDispatch)(ConfirmEmail);
