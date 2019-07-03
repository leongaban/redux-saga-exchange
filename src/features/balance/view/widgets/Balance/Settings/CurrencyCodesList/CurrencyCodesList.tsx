import * as React from 'react';
import block from 'bem-cn';
import { WrappedFieldArrayProps, Field } from 'redux-form';
import { bind } from 'decko';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { IAutocompleteFieldProps, AutocompleteField } from 'shared/view/redux-form';
import { required } from 'shared/helpers/validators';
import { IAssetInfo } from 'shared/types/models';

import './CurrencyCodesList.scss';

const CurrencyCodeField = Field as new () => Field<IAutocompleteFieldProps<[string, IAssetInfo | null]>>;

interface IOwnProps {
  currencyCodesOptions: Array<[string, IAssetInfo]>;
  currencies: number;
}

type IProps = WrappedFieldArrayProps<string> & IOwnProps & ITranslateProps;

const b = block('currency-codes-list');

class CurrencyCodesList extends React.PureComponent<IProps> {

  public componentWillReceiveProps(nextProps: IProps) {
    const addedFieldsNumber = nextProps.currencies - this.props.currencies;
    if (addedFieldsNumber > 0) {
      Array.from({ length: addedFieldsNumber }).forEach(() => {
        this.props.fields.push('');
      });
    } else if (addedFieldsNumber < 0) {
      Array.from({ length: -addedFieldsNumber }).forEach(() => {
        this.props.fields.pop();
      });
    }
  }

  public render() {
    const { fields } = this.props;

    return (
      <div className={b()}>
        {fields.map(this.renderCurrencyCodeSelect)}
      </div>
    );
  }

  @bind
  private renderOptionsValue([optionName, optionAssets]: [string, IAssetInfo]) {
    return (
      <div>
        <img className={b('icon')()} src={optionAssets.imageUrl} />
        {optionName}
      </div>
    );
  }

  @bind
  private withoutCustom(value: string | undefined) {
    const { currencyCodesOptions, translate: t } = this.props;
    return currencyCodesOptions.find(([name]) => name === value) ?
      undefined :
      t('TRADE:BALANCE-WIDGET-SETTINGS:VALIDATION-CUSTOM-CURRENCY');
  }

  @bind
  private withoutDuplication(
    value: string | undefined,
    { currencyCodes }: { currencyCodes: string[] }
  ) {
    const { translate: t } = this.props;
    return currencyCodes.filter(selectedValue =>
      selectedValue === value)
      .length > 1 ?
      t('TRADE:BALANCE-WIDGET-SETTINGS:VALIDATION-DUPLICATED-CURRENCY') :
      undefined;
  }

  @bind
  private renderCurrencyCodeSelect(name: string) {
    const { currencyCodesOptions } = this.props;
    return (
      <div className={b('element')()} key={name}>
        <div className={b('element-field')()}>
          <CurrencyCodeField
            component={AutocompleteField}
            name={name}
            options={currencyCodesOptions}
            optionValueKey={this.getOptionValue}
            placeholder="Search coin"
            defaultOption={['', null]}
            validate={[required, this.withoutCustom, this.withoutDuplication]}
            renderOptionValue={this.renderOptionsValue}
            renderInputValue={this.renderInputValue}
            normalize={this.getOptionValue}
            allowCustomOptions={false}
          />
        </div>
      </div>
    );
  }

  @bind
  private getOptionValue(option: [string, IAssetInfo | null] | string) {
    // TODO looks like a hack
    if (typeof option === 'string') {
      return option;
    }
    const [optionName] = option;
    return optionName.toString();
  }

  @bind
  private renderInputValue(option: [string, IAssetInfo | null] | string) {
    // TODO looks like a hack
    if (typeof option === 'string') {
      return option;
    }
    const [optionName] = option;
    return optionName.toString();
  }
}

type ICurrencyCodesListProps = IOwnProps;

export { ICurrencyCodesListProps };
export default i18nConnect(CurrencyCodesList);
