import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { ErrorScreen } from 'shared/view/components';

import './ErrorBoundary.scss';

interface IProps {
  staticErrorMessage?: string;
  buttonName?: string;
  onButtonClick?(error?: Error): void;
}
interface IState {
  error?: Error;
}

const b = block('error-boundary');

class ErrorBoundary extends React.Component<IProps, IState> {

  public state: IState = {
    error: undefined,
  };

  public componentDidCatch(error: Error) {
    console.error(error);
    this.setState({ error });
  }

  public render() {
    const { error } = this.state;
    const { staticErrorMessage, buttonName } = this.props;
    if (error) {
      const errorMessage = staticErrorMessage ? staticErrorMessage : error.message;
      return (
        <div className={b()}>
          <ErrorScreen
            withIcon
            title="Error"
            buttonName={buttonName}
            message={errorMessage}
            onButtonClick={this.handleButtonClick}
          />
        </div>);
    }
    return this.props.children;
  }

  @bind
  private handleButtonClick() {
    if (this.props.onButtonClick) {
      this.props.onButtonClick(this.state.error);
    }
    this.setState({ error: undefined });
  }
}

export default ErrorBoundary;
