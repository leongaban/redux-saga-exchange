import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';

import {
  SelectField, ISelectFieldProps, AutocompleteField, IAutocompleteFieldProps,
} from 'shared/view/redux-form';
import { transformAssetName } from 'shared/helpers/converters';
import { TransactionType } from 'shared/types/models';
import { Button } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { ITransactionsFilterForm } from '../../../namespace';
import { transactionsFilterFormEntry } from '../../../redux';
import './TransactionsFilterForm.scss';

interface IOwnProps {
  assetsCodes: string[];
  onFormSubmit(): void;
}

type IProps = IOwnProps & ITranslateProps & InjectedFormProps<ITransactionsFilterForm, IOwnProps>;

const b = block('transactions-filter-form');

const transactionTypeSelectOptions: Array<TransactionType | ''> = [
  TransactionType.Deposit,
  TransactionType.Withdrawal,
  TransactionType.Commission,
  '',
];

const { fieldNames, name: formName } = transactionsFilterFormEntry;

class TransactionsFilterForm extends React.PureComponent<IProps> {

  public render() {
    const { reset, translate: t } = this.props;
    return (
      <form className={b()} onSubmit={this.handleFormSubmit}>
        {this.renderLabeledField(
          fieldNames.asset,
          'TRANSACTIONS:FILTER-FORM:ASSET-FILTER-LABEL',
          this.renderAssetsCodesField,
        )}
        {this.renderLabeledField(
          fieldNames.type,
          'TRANSACTIONS:FILTER-FORM:TYPE-FILTER-LABEL',
          this.renderTransactionTypeField,
        )}
        <div className={b('buttons')()}>
          <div className={b('button')()}>
            <Button type="submit" color="green">
              {t('SHARED:BUTTONS:SEARCH')}
            </Button>
          </div>
          <div className={b('button')()}>
            <Button type="submit" color="black-white" onClick={reset}>
              {t('SHARED:BUTTONS:RESET')}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  @bind
  private renderTransactionTypeField(name: string) {
    return (
      <div className={b('type-field')()}>
        <Field<ISelectFieldProps<TransactionType | ''>>
          component={SelectField}
          name={name}
          options={transactionTypeSelectOptions}
          optionValueKey={this.getTransactionTypeOptionValueKey}
        />
      </div>
    );
  }

  @bind
  private renderAssetsCodesField(name: string) {
    const { assetsCodes } = this.props;
    return (
      <div className={b('asset-field')()}>
        <Field<IAutocompleteFieldProps<string>>
          component={AutocompleteField}
          name={name}
          options={assetsCodes}
          optionValueKey={this.getAssetsCodeOptionValueKey}
          renderOptionValue={this.renderAssetsCodeOptionValue}
          renderInputValue={this.renderAssetsCodeOptionValue}
          defaultOption=""
        />
      </div>
    );
  }

  private renderLabeledField(
    name: string,
    i18nLabelKey: string,
    renderField: (name: string) => JSX.Element,
  ) {
    return (
      <div className={b('labeled-field')()}>
        <label className={b('label')()} htmlFor={name}>
          {this.props.translate(i18nLabelKey)}
        </label>
        <div className={b('field')()}>
          {renderField(name)}
        </div>
      </div>
    );
  }

  @bind
  private getAssetsCodeOptionValueKey(x: string) {
    return transformAssetName(x);
  }

  @bind
  private renderAssetsCodeOptionValue(x: string) {
    return transformAssetName(x);
  }

  @bind
  private getTransactionTypeOptionValueKey(x: TransactionType) {
    return TransactionType[x];
  }

  @bind
  private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, onFormSubmit } = this.props;
    handleSubmit(() => onFormSubmit())(e);
  }
}

export default (
  reduxForm<ITransactionsFilterForm, IOwnProps>({
    form: formName,
  })(i18nConnect(TransactionsFilterForm))
);
