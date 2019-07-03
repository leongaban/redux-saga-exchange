import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IAppReduxState } from 'shared/types/app';
import { Button, Modal } from 'shared/view/elements';
import { sessionExpirationLimit } from 'shared/constants';

import moment from 'services/moment';
import { actions, selectors } from '../../../redux';
import './SessionExpiration.scss';

interface IOwnProps {
  onClose(): void;
  onSessionExpired(): void;
}

interface IStateProps {
  isTimerStarted: boolean;
  timerValue: number;
}

interface IDispatchProps {
  startTimer: typeof actions.startTimer;
  stopTimer: typeof actions.stopTimer;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    isTimerStarted: selectors.selectIsTimerStarted(state),
    timerValue: selectors.selectTimerValue(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    startTimer: actions.startTimer,
    stopTimer: actions.stopTimer,
  }, dispatch);
}

const b = block('session-expiration');

class SessionExpiration extends React.Component<IProps> {

  public componentDidMount() {
    const { startTimer } = this.props;
    startTimer(sessionExpirationLimit);
  }

  public componentDidUpdate() {
    const { timerValue, onSessionExpired, onClose } = this.props;
    if (timerValue === 0) {
      onClose();
      onSessionExpired();
    }
  }

  public render() {
    const { isTimerStarted, timerValue, translate: t } = this.props;
    const minutes = Math.floor(timerValue / 60);
    const seconds = Math.floor(timerValue % 60);
    const minutesFormatted = moment(minutes, 'minutes').format('mm');
    const secondsFormatted = moment(seconds, 'seconds').format('ss');
    return (
      <Modal
        title="session expiration"
        isOpen={isTimerStarted}
        onClose={this.handleDontEndSessionButtonClick}
        hasCloseCross
      >
        <div className={b()}>
          <div className={b('clock')()} />
          <div className={b('title')()}>{t('AUTH:SESSION-EXPIRATION:SESSION-EXPIRES')}</div>
          <div className={b('timer')()}>
            <div className={b('minutes')()}>{minutesFormatted}</div>:
            <div className={b('seconds')()}>{secondsFormatted}</div>
          </div>
          <div className={b('button')()}>
            <Button size="large" onClick={this.handleDontEndSessionButtonClick}>
              {t('AUTH:SESSION-EXPIRATION:BUTTON-DONT-END-SESSION')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  @bind
  private handleDontEndSessionButtonClick() {
    const { stopTimer, onClose } = this.props;
    stopTimer();
    onClose();
  }
}

export { SessionExpiration, IProps };
export default connect(mapState, mapDispatch)(
  i18nConnect(
    SessionExpiration,
  ),
);
