import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bind } from 'decko';

import {
  DateInputField, IDateInputFieldProps, SelectField, ISelectFieldProps, AutocompleteField, IAutocompleteFieldProps,
  CheckboxField, ICheckboxFieldProps,
} from 'shared/view/redux-form';
import { selectors as configSelectors } from 'services/config';
import { Button } from 'shared/view/elements';
import moment from 'services/moment';
import { SideFilterOption } from 'shared/types/requests';
import { IAppReduxState } from 'shared/types/app';
import { normalizeDate } from 'shared/helpers/normalizers';
import { transformAssetName } from 'shared/helpers/converters';

import { filterFormEntry } from '../../../redux/reduxFormEntries';
import { IFilterForm } from '../../../namespace';
import './FilterForm.scss';

interface IOwnProps {
  withHidingCanceledField?: boolean;
  onFormSubmit(data: IFilterForm): void;
}

interface IStateProps {
  fromDate: number;
  toDate: number;
  baseCurrency?: string;
  counterCurrency?: string;

  getBaseCurrencies(counterCurrency?: string): string[];
  getCounterCurrencies(baseCurrency?: string): string[];
}

type IProps = IOwnProps & IStateProps & InjectedFormProps<IFilterForm, IOwnProps>;

function mapState(state: IAppReduxState): IStateProps {
  const formData = getFormValues(formName)(state) as IFilterForm;

  return {
    getBaseCurrencies: configSelectors.selectBaseCurrenciesGetter(state),
    getCounterCurrencies: configSelectors.selectCounterCurrenciesGetter(state),
    fromDate: formData && formData.fromDate,
    toDate: formData && formData.toDate,
    baseCurrency: formData && formData.baseCurrency,
    counterCurrency: formData && formData.counterCurrency,
  };
}

const { name: formName, fieldNames } = filterFormEntry;

const b = block('reports-filter-form');

const DateInputFieldWrapper = Field as new () => Field<IDateInputFieldProps>;
const SelectFieldWrapper = Field as new () => Field<ISelectFieldProps<string>>;
const SideOptionSelectFieldWrapper = Field as new () => Field<ISelectFieldProps<SideFilterOption>>;
const AutocompleteFieldWrapper = Field as new () => Field<IAutocompleteFieldProps<string>>;
const CheckboxFieldWrapper = Field as new () => Field<ICheckboxFieldProps>;

interface IDateInputRenderArguments {
  fieldName: string;
  minDate?: number;
  maxDate?: number;
  id?: string;
  doesStoreEndOfDay?: boolean;
}

const sideSelectOptions: SideFilterOption[] = ['all', 'buy', 'sell'];

class FilterForm extends React.PureComponent<IProps> {

  public render() {
    const { reset, withHidingCanceledField } = this.props;
    return (
      <form className={b()} onSubmit={this.handleFormSubmit}>
        {this.renderLabeledFieldSet('date', 'Date', this.renderDateFieldSet)}
        {this.renderLabeledFieldSet('pair', 'Pair', this.renderPairFieldSet)}
        {this.renderLabeledFieldSet('side', 'Side', this.renderSideFieldSet)}
        {withHidingCanceledField &&
          this.renderLabeledFieldSet('hide-canceled', 'Hide all canceled', this.renderHidingCanceledFieldSet)}
        <div className={b('buttons')()}>
          <div className={b('button')()}>
            <Button type="submit" color="green">
              Search
            </Button>
          </div>
          <div className={b('button')()}>
            <Button type="submit" color="black-white" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    );
  }

  @bind
  private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, onFormSubmit } = this.props;
    handleSubmit((data: IFilterForm) => onFormSubmit(data))(e);
  }

  private renderHidingCanceledFieldSet(id: string) {
    return (
      <div className={b('checkbox-field')()}>
        <CheckboxFieldWrapper
          id={id}
          component={CheckboxField}
          name={fieldNames.hideCancelled!}
        />
      </div>
    );
  }

  private renderDateInput({
    id,
    doesStoreEndOfDay,
    fieldName,
    minDate,
    maxDate,
  }: IDateInputRenderArguments) {
    return (
      <div className={b('date-input-field')()}>
        <DateInputFieldWrapper
          component={DateInputField}
          id={id}
          name={fieldName}
          placeholder="dd/mm/yyyy"
          maxDate={maxDate === undefined ? moment() : moment(maxDate)}
          minDate={minDate === undefined ? undefined : moment(minDate)}
          extent="small"
          doesStoreEndOfDay={doesStoreEndOfDay}
          format={normalizeDate}
        />
      </div>
    );
  }

  @bind
  private renderSideFieldSet(id: string) {
    return (
      <div className={b('side-field')()}>
        <SideOptionSelectFieldWrapper
          component={SelectField}
          name={fieldNames.side}
          options={sideSelectOptions}
          optionValueKey={this.orderSideOptionValueKey}
        />
      </div>
    );
  }

  @bind
  private renderPairFieldSet() {
    const { baseCurrency, counterCurrency, getBaseCurrencies, getCounterCurrencies } = this.props;
    // TODO fix Select element for case with empty string option
    return (
      <div className={b('pair-field-set')()}>
        <div className={b('base-currency-field')()}>
          <AutocompleteFieldWrapper
            component={AutocompleteField}
            name={fieldNames.baseCurrency}
            options={getBaseCurrencies(counterCurrency)}
            optionValueKey={this.currencyOptionValueKey}
            renderOptionValue={this.renderPairOptionValue}
            renderInputValue={this.renderPairOptionValue}
            defaultOption=""
          />
        </div>
        <span className={b('pair-field-set-separator')()}>/</span>
        <div className={b('counter-currency-field')()}>
          <SelectFieldWrapper
            component={SelectField}
            name={fieldNames.counterCurrency}
            options={[...getCounterCurrencies(baseCurrency), '']}
            optionValueKey={this.renderPairOptionValue}
          />
        </div>
      </div>
    );
  }

  @bind
  private renderDateFieldSet(id: string) {
    const { fromDate, toDate } = this.props;
    return (
      <div className={b('date-field-set')()}>
        {this.renderDateInput({
          fieldName: fieldNames.fromDate,
          maxDate: toDate,
          id,
        })}
        <span className={b('date-field-set-separator')()}>&mdash;</span>
        {this.renderDateInput({
          fieldName: fieldNames.toDate,
          doesStoreEndOfDay: true,
          minDate: fromDate,
        })}
      </div>
    );
  }

  private renderLabeledFieldSet(
    id: string,
    label: string,
    renderFieldSet: (id: string) => JSX.Element | JSX.Element[],
  ) {
    return (
      <div className={b('labeled-field-set')()}>
        <label className={b('label')()} htmlFor={id}>
          {label}
        </label>
        <div className={b('field-set')()}>
          {renderFieldSet(id)}
        </div>
      </div>
    );
  }

  @bind
  private currencyOptionValueKey(x: string) {
    return x.toUpperCase();
  }

  @bind
  private renderPairOptionValue(x: string) {
    return transformAssetName(x);
  }

  @bind
  private orderSideOptionValueKey(x: SideFilterOption) {
    return x
      ? x[0].toUpperCase() + x.slice(1)
      : '';

  }
}

export default (
  reduxForm<IFilterForm, IOwnProps>({
    form: formName,
    // initialValues: { toDate: +moment(), side: 'all' },
  })(
    connect(mapState, () => ({}))(
      FilterForm,
    )));
