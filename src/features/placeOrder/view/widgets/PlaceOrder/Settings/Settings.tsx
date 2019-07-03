import * as React from 'react';
import block from 'bem-cn';

import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';

import { IHoldingInitialSettings, IPlaceOrderFormSettings, SidesDisplayMethod } from 'shared/types/models';
import { IRadioFieldProps, RadioField } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { reduxFormEntries } from '../../../../redux';
import './Settings.scss';

const { placeOrderSettingsFormEntry: { name: formName, fieldNames } } = reduxFormEntries;

interface IOwnProps extends IHoldingInitialSettings<IPlaceOrderFormSettings> { }

type IProps = InjectedFormProps<IPlaceOrderFormSettings, IOwnProps> & IOwnProps & ITranslateProps;

const RadioFieldWrapper = Field as new () => Field<IRadioFieldProps>;

const b = block('place-order-settings');

const sidesDisplayMethodLabelsI18nKeys: Record<SidesDisplayMethod, string> = {
  'both-sides': 'PLACE-ORDER:BOTH-SIDES-DISPLAY-METHOD-RADIO-LABEL',
  'single-side-with-swtich': 'PLACE-ORDER:SINGLE-SIDE-DISPLAY-METHOD-RADIO-LABEL',
};

const sidesDisplayMethods: SidesDisplayMethod[] = ['both-sides', 'single-side-with-swtich'];

class Settings extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {

    return (
      <div className={b()}>
        <div className={b('sides-display-method-radios')()}>
          {sidesDisplayMethods.map(this.renderSidesDisplayMethodRadio)}
        </div>
      </div>
    );
  }

  @bind
  private renderSidesDisplayMethodRadio(method: SidesDisplayMethod) {
    const { translate: t } = this.props;

    return (
      <div className={b('sides-display-method-radio')()} key={method}>
        <RadioFieldWrapper
          name={fieldNames.sidesDisplayMethod}
          component={RadioField}
          label={t(sidesDisplayMethodLabelsI18nKeys[method])}
          radioValue={method}
        />
      </div>
    );
  }
}

export default (
  reduxForm<IPlaceOrderFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings
    )));
