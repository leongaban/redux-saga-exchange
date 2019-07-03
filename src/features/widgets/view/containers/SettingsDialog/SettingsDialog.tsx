import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ConfigProps, submit, FormSubmitHandler } from 'redux-form';
import block from 'bem-cn';
import { bind } from 'decko';

import { Modal, Button } from 'shared/view/elements';
import { WidgetSettings } from 'shared/types/models';

import { actions } from '../../../redux';

import './SettingsDialog.scss';

import { ITranslateProps, i18nConnect } from 'services/i18n';

interface IOwnProps {
  isOpen: boolean;
  Form: React.ComponentType<Partial<ConfigProps<WidgetSettings, {}>>>;
  formName: string;
  onFormSubmit: FormSubmitHandler<WidgetSettings, {}>;
  onClose(): void;
}

interface IActionProps {
  submitForm: typeof submit;
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({ submitForm: submit, ...actions }, dispatch);
}

type IProps = IOwnProps & IActionProps & ITranslateProps;

const b = block('settings-dialog');

class SettingsDialog extends React.PureComponent<IProps> {

  public render() {
    const { translate: t, isOpen, onClose, Form, onFormSubmit } = this.props;
    return (
      <Modal title={t('WIDGETS:SETTINGS-DIALOG:TITLE')} isOpen={isOpen} onClose={onClose} hasBotttomBorderAtHeader>
        <div className={b()}>
          <div className={b('section')()}>
            <Form onSubmit={onFormSubmit} />
          </div>
        </div>
        <div className={b('buttons')()}>
          <div className={b('button')()}>
            <Button size="medium" color="black-white" type="button" onClick={onClose}>
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
          <div className={b('button')()}>
            <Button size="medium" color="green" type="button" onClick={this.handleSaveSettingsButtonClick}>
              {t('SHARED:BUTTONS:SAVE')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  @bind
  private handleSaveSettingsButtonClick() {
    const { formName, submitForm } = this.props;
    submitForm(formName);
  }
}

export default (
  connect(null, mapDispatch)(
    i18nConnect(
      SettingsDialog,
    ),
  )
);
