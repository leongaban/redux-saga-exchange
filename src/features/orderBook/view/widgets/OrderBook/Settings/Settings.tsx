import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { IHoldingInitialSettings, IOrderBookFormSettings } from 'shared/types/models';
import { ToggleField, IToggleFieldProps } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { orderBookSettingsFormEntry } from '../../../../redux/reduxFormEntries';

interface IOwnProps extends IHoldingInitialSettings<IOrderBookFormSettings> { }

type IProps = IOwnProps & InjectedFormProps<IOrderBookFormSettings, IOwnProps> & ITranslateProps;

const { name: formName, fieldNames } = orderBookSettingsFormEntry;

const b = block('order-book-settings');

class Settings extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { translate: t } = this.props;

    return (
      <div className={b()}>
        <Field<IToggleFieldProps>
          name={fieldNames.shouldOpenModalOnPlaceOrderRequest}
          component={ToggleField}
          leftLabel={t('SHARED:LABELS:INACTIVE')}
          rightLabel={t('SHARED:LABELS:ACTIVE')}
          title={t('TRADE:ORDER-BOOK-SETTINGS:PLACE-ORDER-MODAL-ACTIVE-TITLE')}
        />
        <Field<IToggleFieldProps>
          name={fieldNames.depthView}
          component={ToggleField}
          leftLabel={t('SHARED:LABELS:INACTIVE')}
          rightLabel={t('SHARED:LABELS:ACTIVE')}
          title={t('TRADE:ORDER-BOOK-SETTINGS:DEPTH-VIEW-TITLE')}
        />
      </div>
    );
  }
}

export default (
  reduxForm<IOrderBookFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings,
    ),
  )
);
