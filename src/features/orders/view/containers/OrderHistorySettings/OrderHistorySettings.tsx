import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';
import * as R from 'ramda';

import { IHoldingInitialSettings, IOrderHistoryFormSettings } from 'shared/types/models';
import { CheckboxField, ICheckboxFieldProps } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { SettingsSection } from 'shared/view/components';
import { archiveOrderColumnsTitles } from 'shared/constants';

import { orderHistorySettingsFormEntry } from '../../../redux/data/reduxFormEntries';
import './OrderHistorySettings.scss';

const { name: formName, fieldNames } = orderHistorySettingsFormEntry;

type IOwnProps = IHoldingInitialSettings<IOrderHistoryFormSettings>;

type IProps = IOwnProps & InjectedFormProps<IOrderHistoryFormSettings, IOwnProps> & ITranslateProps;

const b = block('orders-history-settings');

class OrderHistorySettings extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { translate: t } = this.props;
    const fields = R.keys(fieldNames);

    return (
      <form className={b()}>
        <SettingsSection title={t('TRADE:ADD-WIDGET-VISIBLE-COLUMNS-LABEL')}>
          <div className={b('column-check-section')()}>
            {fields.map(this.renderCheckbox)}
          </div>
        </SettingsSection>
      </form>
    );
  }

  @bind
  private renderCheckbox(name: keyof typeof archiveOrderColumnsTitles, index: number) {
    return (
      <div className={b('column-check-element')()} key={String(name)}>
        <Field<ICheckboxFieldProps>
          component={CheckboxField}
          name={String(name)}
          label={archiveOrderColumnsTitles[name]}
        />
      </div>
    );
  }
}

export default (
  reduxForm<IOrderHistoryFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      OrderHistorySettings,
    )));
