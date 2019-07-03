import * as React from 'react';
import * as R from 'ramda';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { FieldArray, reduxForm, InjectedFormProps } from 'redux-form';
import { IAppReduxState } from 'shared/types/app';
import {
  IHoldingInitialSettings, IBalanceFormSettings, IAssetsInfoMap,
} from 'shared/types/models'; // TODO holding initial is not a model
import { SettingsSection } from 'shared/view/components';
import { Select } from 'shared/view/elements';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';

import { balanceSettingsFormEntry } from '../../../../redux/reduxFormEntries';
import CurrencyCodesList, { ICurrencyCodesListProps } from './CurrencyCodesList/CurrencyCodesList';
import './Settings.scss';

interface IOwnProps extends IHoldingInitialSettings<IBalanceFormSettings> { }

type IProps = IOwnProps & IStateProps & InjectedFormProps<IBalanceFormSettings, IOwnProps> & ITranslateProps;

const { name: formName, fieldNames } = balanceSettingsFormEntry;

const b = block('balance-settings');

const CurrencyCodesFields = FieldArray as new () => FieldArray<ICurrencyCodesListProps>;

interface IState {
  currenciesNumber: number;
}

interface IStateProps {
  assetsInfo: IAssetsInfoMap;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

const currenciesNumberOptions = R.range(1, 11);

class Balance extends React.PureComponent<IProps, IState> {
  public state: IState = { currenciesNumber: this.props.initialSettings.currencyCodes.length };

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { currenciesNumber } = this.state;
    const { translate: t, assetsInfo } = this.props;
    return (
      <div className={b()}>
        <SettingsSection isHigher title={t('TRADE:BALANCE-WIDGET-SETTINGS:NUMBER-OF-CURRENCIES-SECTION-TITLE')}>
          <div className={b('currencies-number-select')()}>
            <Select
              options={currenciesNumberOptions}
              optionValueKey={this.getOptionValue}
              selectedOption={currenciesNumber}
              onSelect={this.handleCurrenciesNumberSelect}
            />
          </div>
        </SettingsSection>
        <SettingsSection title={t('TRADE:BALANCE-WIDGET-SETTINGS:DISPLAYED-CURRENCIES-SECTION-TITLE')}>
          <CurrencyCodesFields
            component={CurrencyCodesList}
            currencyCodesOptions={R.toPairs(assetsInfo)}
            currencies={currenciesNumber}
            name={fieldNames.currencyCodes}
          />
        </SettingsSection>
      </div >
    );
  }

  @bind
  private handleCurrenciesNumberSelect(x: number) {
    this.setState(() => ({ currenciesNumber: x }));
  }

  @bind
  private getOptionValue(x: number) {
    return x.toString();
  }
}

export default (
  reduxForm<IBalanceFormSettings, IOwnProps>({ form: formName })(
    connect(mapState, () => ({}))(
      i18nConnect(
        Balance,
      ),
    ),
  )
);
