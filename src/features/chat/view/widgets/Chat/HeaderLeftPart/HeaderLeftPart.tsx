import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, InjectedFormProps, submit } from 'redux-form';
import { bind } from 'decko';

import { notDraggableClassName } from 'shared/constants';
import { Action } from 'shared/types/redux';
import { Icon, WidgetTitle } from 'shared/view/elements';
import { IInputFieldProps, InputField } from 'shared/view/redux-form';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { actions, reduxFormEntries } from '../../../../redux';
import * as NS from '../../../../namespace';
import './HeaderLeftPart.scss';

interface IActionProps {
  submitSearchForm: Action<NS.ISubmitSearchForm>;
  submitForm: typeof submit;
}

interface IState {
  isSearchModeActive: boolean;
}

type IProps = IActionProps & ITranslateProps & InjectedFormProps<NS.ISearchForm, {}>;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({ ...actions, submitForm: submit }, dispatch);
}

const InputFieldWrapper = Field as new () => Field<IInputFieldProps>;
const { searchFormEntry: { name: formName, fieldNames } } = reduxFormEntries;

const b = block('chat-widget-header-left-part');

class HeaderLeftPart extends React.PureComponent<IProps, IState> {

  public state: IState = { isSearchModeActive: false };

  private activateSearchMode = this.makeSearchModeSetter(true);

  public render() {

    return (
      <div className={b()}>
        <WidgetTitle>CHAT</WidgetTitle>
        <form className={notDraggableClassName} onSubmit={this.handleSearchFormSubmit} >
          {this.renderSearchPart()}
        </form>
      </div>
    );
  }

  private renderSearchPart() {
    const { translate: t } = this.props;
    const { isSearchModeActive } = this.state;

    return isSearchModeActive
      ? (
        <InputFieldWrapper
          component={InputField}
          name={fieldNames.text}
          type="text"
          placeholder={t('CHAT:HEADER:SEARCH-INPUT-PLACEHOLDER')}
          renderRightPart={this.renderSearchInputRightPart}
          fieldMixin={b('search-input-field')()}
          onKeyDown={this.handleSearchKeyDown}
        />
      )
      : (
        <div className={b('search-icon-wrapper')()} onClick={this.activateSearchMode}>
          {this.renderSearchIcon()}
        </div>
      );
  }

  @bind
  private handleSearchFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, submitSearchForm } = this.props;
    handleSubmit(submitSearchForm)(e);
  }

  @bind
  private renderSearchInputRightPart() {
    return (
      <div className={b('search-input-icons')()}>
        <div className={b('cancel-icon-wrapper')()} onClick={this.deactivateSearchMode}>
          <Icon className={b('cancel-icon')()} src={require('../../../images/close-inline.svg')} />
        </div>
      </div>
    );
  }

  @bind
  private deactivateSearchMode() {
    this.makeSearchModeSetter(false)();
    this.props.reset();
  }

  @bind
  private handleSearchKeyDown(event: KeyboardEventInit) {
    if (event.key === 'Escape') {
      this.deactivateSearchMode();
    }
  }

  private renderSearchIcon() {
    return <Icon className={b('search-icon')()} src={require('../../../images/search-inline.svg')} />;
  }

  private makeSearchModeSetter(value: boolean) {
    return () => this.setState(() => ({ isSearchModeActive: value }));
  }
}

export default (
  reduxForm<NS.ISearchForm, {}>({
    form: formName,
  })(
    connect(() => ({}), mapDispatch)(
      i18nConnect(
        HeaderLeftPart,
      ))));
