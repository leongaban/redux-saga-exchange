import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import * as R from 'ramda';

import { CheckboxField, ICheckboxFieldProps } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { IHoldingInitialSettings, IActiveOrderColumnData, IOrderListFormSettings } from 'shared/types/models';
import { SettingsSection } from 'shared/view/components';
import { activeOrderColumnsTitles } from 'shared/constants';

import { orderListSettingsFormEntry } from '../../../../redux/data/reduxFormEntries';
import './Settings.scss';

interface IOwnProps extends IHoldingInitialSettings<IOrderListFormSettings> { }

type IProps = InjectedFormProps<IOrderListFormSettings, IOwnProps> & IOwnProps & ITranslateProps;

const b = block('orders-list-settings');

const ColumnCheckboxFieldWrapper = Field as new () => Field<ICheckboxFieldProps>;

const { fieldNames, name: formName } = orderListSettingsFormEntry;

class Settings extends React.PureComponent<IProps> {
  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { translate: t } = this.props;
    const columnOptionsFields = R.reject(
      fieldName => fieldName === fieldNames.shouldOpenCancelOrderModal,
      R.keys(fieldNames)
    );
    return (
      <form className={b()}>
        <SettingsSection title={t('TRADE:ADD-WIDGET-VISIBLE-COLUMNS-LABEL')}>
          <div className={b('options-section')()}>
            {columnOptionsFields.map(this.renderColumnOptionsCheckbox)}
          </div>
        </SettingsSection>
        <SettingsSection title={t('ORDER-LIST:SHOW-CANCEL-ORDER-CONFIRMATION-DIALOG:OPTION-TITLE')}>
          <div className={b('options-section')()}>
            {this.renderConfirmationModalOptionCheckbox()}
          </div>
        </SettingsSection>
      </form>
    );
  }

  @bind
  private renderColumnOptionsCheckbox(name: keyof IActiveOrderColumnData) {

    return (
      <div className={b('option')()} key={String(name)}>
        <ColumnCheckboxFieldWrapper
          component={CheckboxField}
          name={String(name)}
          label={activeOrderColumnsTitles[name]}
        />
      </div>
    );
  }

  @bind
  private renderConfirmationModalOptionCheckbox() {
    const name = fieldNames.shouldOpenCancelOrderModal;
    const { translate: t } = this.props;
    return (
      <div className={b('option')()} key={String(name)}>
        <ColumnCheckboxFieldWrapper
          component={CheckboxField}
          name={String(name)}
          label={t('ORDER-LIST:SHOW-CANCEL-ORDER-CONFIRMATION-DIALOG:CHECKBOX-LABEL')}
        />
      </div>
    );
  }
}

export default (
  reduxForm<IOrderListFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings
    )));
