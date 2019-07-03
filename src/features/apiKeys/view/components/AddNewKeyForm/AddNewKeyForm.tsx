import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps, FieldArray } from 'redux-form';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import {
  IInputFieldProps,
  InputField,
  ICheckboxFieldProps,
  CheckboxField
} from 'shared/view/redux-form';
import { Button } from 'shared/view/elements';
import { required } from 'shared/helpers/validators';

import { INewApiKeyForm } from '../../../namespace';
import { reduxFormEntries } from '../../../redux';
import { MAX_API_KEY_LABEL_LENGTH } from '../../../constants';
import IPInputAddress from '../IpAddressesList/IpAddressesList';
import './AddNewKeyForm.scss';

interface IOwnProps {
  defaultKeyName: string;
  isShownPreloader: boolean;
  formValues?: INewApiKeyForm;
  onSubmit(data: INewApiKeyForm): void;
}

const b = block('add-new-key-form');
const { newApiKeyFormEntry: { name, fieldNames } } = reduxFormEntries;

const initData: INewApiKeyForm = {
  label: '',
  readAccess: true,
  withdrawal: false,
  trading: true,
  ipAddressList: []
};

type IProps = IOwnProps & ITranslateProps & InjectedFormProps<INewApiKeyForm, IOwnProps>;

class AddNewKeyForm extends React.PureComponent<IProps> {
  public componentDidMount() {
    this.props.initialize({
      ...initData,
      label: this.props.defaultKeyName
    });
  }

  public render() {
    const { translate: t, formValues, isShownPreloader } = this.props;

    if (!formValues) {
      return null;
    }

    return (
      <form
        onSubmit={this.handleFormSubmit}
        className={b()}
        noValidate
      >
        <label className={b('input-field')()}>
          <p className={b('label')()}>{t('API-KEYS:KEY-LABEL')}</p>
          <Field<IInputFieldProps>
            name={fieldNames.label}
            type="text"
            component={InputField}
            validateOnBlur
            validateOnChange
            maxLength={MAX_API_KEY_LABEL_LENGTH}
            validate={required}
            placeholder={t('API-KEYS:CREATE-KEY-PLACEHOLDER')}
          />
        </label>
        <p className={b('details-title')()}>
          {t('API-KEYS:ENABLED')}:
        </p>
        <div className={b('details')()}>
          {this.renderCheckbox(fieldNames.readAccess, 'API-KEYS:CHEKBOXES-READ')}
          {this.renderCheckbox(fieldNames.trading, 'API-KEYS:CHEKBOXES-TRADING')}
          {this.renderCheckbox(fieldNames.withdrawal, 'API-KEYS:CHEKBOXES-WITHDRAWALS', true)}
        </div>
        {formValues.withdrawal && (<>
            <div className={b('info')()}>
              {t('API-KEYS:WITHDRAWALS-INFO')}
            </div>
            <FieldArray
              name={fieldNames.ipAddressList}
              component={IPInputAddress}
            />
        </>)}
        <Button isShowPreloader={isShownPreloader} disabled={isShownPreloader}>
          {!isShownPreloader && t('API-KEYS:GENERATE-KEY')}
        </Button>
      </form>
    );
  }

  private renderCheckbox(propName: keyof INewApiKeyForm, label: string, disabled?: boolean) {
    const { translate: t } = this.props;
    return (
      <span className={b('checkbox')()}>
        <Field<ICheckboxFieldProps>
          name={propName}
          type="checkbox"
          disabled={disabled}
          component={CheckboxField}
          label={t(label)}
        />
      </span>
    );
  }

  @bind
  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { handleSubmit, onSubmit } = this.props;
    handleSubmit((data) => {
      onSubmit(data);
    })(event);
  }
}

const translated = i18nConnect(AddNewKeyForm);
const formed = reduxForm<INewApiKeyForm, IOwnProps>({ form: name })(translated);

export default formed;
