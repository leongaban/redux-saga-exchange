import * as React from 'react';
import block from 'bem-cn';

import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';

import { IHoldingInitialSettings, IExchangeRatesFormSettings } from 'shared/types/models';
import { SettingsSection } from 'shared/view/components';
import { ICheckboxFieldProps, CheckboxField } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { reduxFormEntries } from '../../../../redux';
import { exchangeRatesColumnsTitles } from '../../../../constants';
import './Settings.scss';

const { exchangeRatesSettingsFormEntry: { name: formName, fieldNames } } = reduxFormEntries;

interface IOwnProps extends IHoldingInitialSettings<IExchangeRatesFormSettings> { }

type IProps = InjectedFormProps<IExchangeRatesFormSettings, IOwnProps> & IOwnProps & ITranslateProps;

const b = block('ecxhange-rates-settings');

class Settings extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { translate: t } = this.props;

    const fields = Object.keys(fieldNames) as Array<keyof typeof fieldNames>;
    return (
      <div className={b()}>
        <SettingsSection title={t('TRADE:ADD-WIDGET-VISIBLE-COLUMNS-LABEL')}>
          <div className={b('visible-columns')()}>
            {fields.map(this.renderCheckbox)}
          </div>
        </SettingsSection>
      </div>
    );
  }

  @bind
  private renderCheckbox(name: keyof typeof fieldNames) {
    return (
      <Field<ICheckboxFieldProps>
        name={name}
        component={CheckboxField}
        label={exchangeRatesColumnsTitles[name]}
      />
    );
  }
}

export default (
  reduxForm<IExchangeRatesFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings
    )));
