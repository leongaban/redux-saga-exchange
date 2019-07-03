import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { bind } from 'decko';

import { Modal, Button } from 'shared/view/elements';
import { actions as configActions, selectors as configSelectors } from 'services/config';

import { IAppReduxState } from 'shared/types/app';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import NoticeItem from './TwoFactorNoticeItem';

import './TwoFactorNotice.scss';

const b = block('two-factor-notice');

interface IOwnProps {
  onAccept(): void;
}

interface IStateProps {
  is2FANoticeSaving: boolean;
}

interface IDispatchProps {
  saveUserConfig: typeof configActions.saveUserConfig;
}

interface IState {
  lineChecks: Record<string, boolean>;
}

function mapState(state: IAppReduxState) {
  return {
    is2FANoticeSaving: configSelectors.selectCommunication(state, 'saveUserConfig').isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators(
    {
      saveUserConfig: configActions.saveUserConfig,
    },
    dispatch,
  );
}

type IProps = IOwnProps & IStateProps & IDispatchProps & ITranslateProps;

const reduceLines = (prevState: IState) => (acc: {}, line: string) => ({
  ...acc,
  [line]: prevState.lineChecks[line] || false,
});

class TwoFANotice extends React.Component<IProps, IState> {
  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const translated = nextProps.translate('AUTH:TWO-FA-NOTICE:BODY');
    return { ...prevState, lineChecks: translated.split('\n').reduce(reduceLines(prevState), {}) };
  }

  public state: IState = {
    lineChecks: {},
  };

  public render() {
    const { is2FANoticeSaving, translate: t } = this.props;
    const textLines = Object.keys(this.state.lineChecks);
    const isReady = Object.values(this.state.lineChecks).every(Boolean);

    return (
      <Modal
        title={t('AUTH:TWO-FA-NOTICE:TITLE')}
        isOpen={true}
        onClose={this.handleConfirmClick}
        withVerticalScroll
        hasBotttomBorderAtHeader
        shouldCloseOnEsc={false}
      >
        <div className={b()}>
          {textLines.map(line => (
            <NoticeItem
              key={line}
              text={line}
              isChecked={this.state.lineChecks[line]}
              onChange={this.handleItemChange}
            />
          ))}
          <Button
            onClick={this.handleConfirmClick}
            disabled={is2FANoticeSaving || !isReady}
            isShowPreloader={is2FANoticeSaving}
          >
            {t('AUTH:TWO-FA-NOTICE:BUTTON')}
          </Button>
        </div>
      </Modal>
    );
  }

  @bind
  private handleItemChange(line: string, newValue: boolean) {
    this.setState({ lineChecks: { ...this.state.lineChecks, [line]: newValue } });
  }

  @bind
  private handleConfirmClick() {
    const { saveUserConfig, onAccept } = this.props;
    saveUserConfig({ isSecurityNoticeConfirmed: true });
    onAccept();
  }
}

export default connect(
  mapState,
  mapDispatch,
)(i18nConnect(TwoFANotice));
