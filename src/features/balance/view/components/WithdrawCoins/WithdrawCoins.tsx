import * as React from 'react';
import * as walletAddressValidator from 'wallet-address-validator';
import * as bchaddr from 'bchaddrjs';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps, Validator } from 'redux-form';
import { bind } from 'decko';
import uuid from 'uuid';
import { Decimal } from 'decimal.js';

import { floorFloat, floorFloatToFixed } from 'shared/helpers/number';
import { Button, Icon, Tooltip } from 'shared/view/elements';
import { IWithdrawToWalletRequest } from 'shared/types/requests';
import { normalizeFloat } from 'shared/helpers/normalizers';
import { required, moreThan, validateStellarAddress, validateEosAddress } from 'shared/helpers/validators';
import { InputField, IInputFieldProps, AutocompleteField, IAutocompleteFieldProps } from 'shared/view/redux-form';
import { namespace as i18nNS } from 'services/i18n';
import { actions as notificationActions } from 'services/notification';
import { IAssetsInfoMap, ISavedWithdrawalAddress, ISavedWithdrawalAddresses } from 'shared/types/models';
import { fractionalPartLengths, transferIdPrefixes } from 'shared/constants';
import { ICommunication } from 'shared/types/redux';

import { withdrawCoinsFormEntry } from '../../../redux/reduxFormEntries';
import { actions } from '../../../redux';
import { IWithdrawCoinsFormData } from '../../../namespace';
import { maxSavedWithdrawalAddresses, maxNewAddressLabelLength } from './constants';
import './WithdrawCoins.scss';

const b = block('withdraw-coins');

// TODO: This should - ideally - come as currency metadata.
const CURRENCIES_WITH_MEMO_SUPPORT = [
  'xlm',
  'eos',
];

const isMemoNeeded = (currencyCode: string) => CURRENCIES_WITH_MEMO_SUPPORT.includes(currencyCode);

interface IOwnProps {
  currencyCode: string | null;
  translate: i18nNS.TranslateFunction;
  saveWithdrawalAddress: typeof actions.saveWithdrawalAddress;
  deleteWithdrawalAddress: typeof actions.deleteWithdrawalAddress;
  setNotification: typeof notificationActions.setNotification;
  availableBalance: number | null;
  withdrawAmount: string | null;
  assetsInfo: IAssetsInfoMap;
  withdrawCoinsCommunication: ICommunication;
  savedWithdrawalAddresses: ISavedWithdrawalAddresses;
  withdrawCoins(request: IWithdrawToWalletRequest): void;
  onCancelButtonClick(): void;
}

type IProps = IOwnProps & InjectedFormProps<IWithdrawCoinsFormData, IOwnProps>;

interface IState {
  areNewAddressFieldsShown: boolean;
  isWithdrawAddressFieldDisabled: boolean;
}

const { name: formName, fieldNames } = withdrawCoinsFormEntry;

const InputFieldWrapper = Field as new () => Field<IInputFieldProps>;
const AutocompleteFieldWrapper = Field as new () => Field<IAutocompleteFieldProps<ISavedWithdrawalAddress | string>>;

interface ILabeledField {
  name: string;
  label: string;
  placeholder: string;
  validate?: Validator[];
  normalize?(value: string): string;
}

const moreThanZero = moreThan('should be more than 0', 0);
const ethereumBasedAssets = [
  'tiox', 'zrx', 'omg', 'key', 'bat', 'rep', 'ttv', 'dog', 'btnt', 'ktos',
  'gnt', 'pco', 'xrr', 'dai', 'link', 'snt', 'mith', 'eth', 'mkr', 'xyo', 'tusd',
];

class WithdrawCoins extends React.PureComponent<IProps, IState> {

  public state: IState = {
    areNewAddressFieldsShown: false,
    isWithdrawAddressFieldDisabled: false,
  };

  private labeledFields: ILabeledField[] = (() => {
    const { translate: t } = this.props;
    return [{
      name: fieldNames.amount,
      label: t('BALANCE:WITHDRAW-COINS-DIALOG:AMOUNT-FIELD-LABEL'),
      placeholder: t('BALANCE:WITHDRAW-COINS-DIALOG:AMOUNT-FIELD-PLACEHOLDER'),
      normalize: this.normalizeAmount,
      validate: [required, moreThanZero, this.validateWithdrawalAmount],
    }, {
      name: fieldNames.address,
      label: t('BALANCE:WITHDRAW-COINS-DIALOG:WITHDRAW-ADDRESS-FIELD-LABEL'),
      placeholder: t('BALANCE:WITHDRAW-COINS-DIALOG:WITHDRAW-ADDRESS-FIELD-PLACEHOLDER'),
      validate: [this.validateEnterWithdrawAddressField]
    }];
  })();

  public componentDidMount() {
    Decimal.set({ precision: 50 });
  }

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const { currencyCode } = this.props;

    return currencyCode
      ? this.renderContent(currencyCode)
      : null;
  }

  private renderContent(currencyCode: string) {
    const { translate: t, withdrawCoinsCommunication, onCancelButtonClick } = this.props;
    const isWithdrawRequesting = withdrawCoinsCommunication.isRequesting;

    return (
      <form className={b()} onSubmit={this.handleSubmit}>
        <div className={b('fields-and-details')()}>
          <div className={b('fields')()}>
            {this.labeledFields.map(this.renderLabeledField)}
            {this.state.areNewAddressFieldsShown && this.renderNewAddressFields()}
            {isMemoNeeded(currencyCode) && this.renderLabeledField({
              name: fieldNames.memo,
              label: t('BALANCE:WITHDRAW-COINS-DIALOG:MEMO-FIELD-LABEL'),
              placeholder: t('BALANCE:WITHDRAW-COINS-DIALOG:MEMO-FIELD-PLACEHOLDER'),
            }, this.labeledFields.length)}
          </div>
          {this.renderDetails(currencyCode)}
        </div>
        <div className={b('buttons')()}>
          <div className={b('button')()}>
            <Button type="button" color="black-white" onClick={onCancelButtonClick}>
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
          <div className={b('button')()}>
            <Button disabled={isWithdrawRequesting} isShowPreloader={isWithdrawRequesting} color="green">
              {t('SHARED:BUTTONS:SUBMIT')}
            </Button>
          </div>
          {
            ethereumBasedAssets.includes(currencyCode)
              ? (
                <div className={b('warning')()}>
                  <Tooltip text={t('BALANCE:WITHDRAW-COINS-DIALOG:SMART-CONTRACT-WARNING-TEXT')} position="bottom">
                    <Icon className={b('warning-icon')()} src={require('./img/error-inline.svg')} />
                  </Tooltip>
                </div>
              ) : null
          }
        </div>
      </form>
    );
  }

  @bind
  private renderGenericField(labeledField: ILabeledField) {
    const { name, placeholder, normalize, validate } = labeledField;
    return (
      <InputFieldWrapper
        component={InputField}
        name={name}
        placeholder={placeholder}
        id={name}
        normalize={normalize}
        validate={validate}
      />
    );
  }

  @bind
  private renderAddressField(labeledField: ILabeledField) {
    const { name, placeholder, normalize, validate } = labeledField;
    const { translate: t, savedWithdrawalAddresses, currencyCode } = this.props;
    const savedAddresses = currencyCode !== null && savedWithdrawalAddresses[currencyCode]
      ? savedWithdrawalAddresses[currencyCode]
      : [];
    return (
      <AutocompleteFieldWrapper
        component={AutocompleteField}
        options={savedAddresses}
        defaultOption=""
        optionValueKey={this.getAddressValueKey}
        renderOptionValue={this.renderSavedAddressOption}
        name={name}
        placeholder={placeholder}
        addOptionText={t('BALANCE:WITHDRAW-COINS-DIALOG:USE-NEW-ADDRESS')}
        onAddOptionClick={this.handleAddressInputAddOptionClick}
        normalize={normalize}
        validate={validate}
        disabled={this.state.isWithdrawAddressFieldDisabled}
        onOptionDelete={this.handleSavedAddressDelete}
        isShowSelectedOptionDisabled
        allowCustomOptions
      />
    );
  }

  @bind
  private renderLabeledField(labeledField: ILabeledField, index: number) {
    const { label, name } = labeledField;
    return (
      <div className={b('labeled-field')()} key={index}>
        <label className={b('label')()} htmlFor={name}>
          {label}
        </label>
        <div className={b('field')()}>
          {name === fieldNames.address && this.renderAddressField(labeledField)}
          {name === fieldNames.amount && this.renderGenericField(labeledField)}
          {name === fieldNames.memo && this.renderGenericField(labeledField)}
        </div>
      </div>
    );
  }

  private renderSavedAddressOption(savedAddress: ISavedWithdrawalAddress) {
    return (
      <span>
        {`${Object.keys(savedAddress)[0]} — ${Object.values(savedAddress)[0]}`}
      </span>
    );
  }

  private renderNewAddressFields() {
    const { translate: t } = this.props;
    return (
      <div className={b('new-address')()}>
        <div className={b('new-address-label-field')()}>
          <InputFieldWrapper
            component={InputField}
            name={fieldNames.newAddressLabel}
            placeholder={t('BALANCE:WITHDRAW-COINS-DIALOG:NEW-ADDRESS-LABEL')}
            validate={[required, this.validateNewAddressLabel]}
          />
        </div>
        <span className={b('fields-separator')()}>-</span>
        <div className={b('new-address-field')()}>
          <InputFieldWrapper
            component={InputField}
            name={fieldNames.newAddress}
            placeholder={t('BALANCE:WITHDRAW-COINS-DIALOG:NEW-ADDRESS')}
            validate={[required, this.validateNewAddressField]}
          />
        </div>
      </div>
    );
  }

  private getAddressValueKey(x: ISavedWithdrawalAddress | string) {
    return typeof x === 'string' ? x : Object.values(x)[0];
  }

  private renderDetails(currencyCode: string) {
    const { translate: t, assetsInfo, availableBalance, withdrawAmount } = this.props;
    const { withdrawalFee = 0 } = assetsInfo[currencyCode];
    const value = this.calculateTotal(withdrawAmount);
    const commissionValue = this.formatValue(currencyCode, withdrawalFee);

    return (
      <div className={b('details')()}>
        <div className={b('details-upper-part')()}>
          <div className={b('details-title')()}>
            {t('BALANCE:WITHDRAW-COINS-DIALOG:DETAILS-TITLE')}
          </div>
          <div className={b('details-withdraw-value')()}>
            {value}
          </div>
        </div>
        <div className={b('details-lower-part')()}>
          <div className={b('details-available-balance')()}>
            {t('BALANCE:WITHDRAW-COINS-DIALOG:AVAILABLE-BALANCE-LABEL')}
            &#160;
            <span className={b('details-available-balance-value')()} onClick={this.handleAvailableBalanceValueClick}>
              {availableBalance ? this.formatValue(currencyCode, availableBalance) : ' - '}
            </span>
          </div>
          <div className={b('details-commission-presentation')()}>
            {`${t('BALANCE:WITHDRAW-COINS-DIALOG:WITHDRAW-FEE-LABEL')} ${commissionValue}`}
          </div>
        </div>
      </div>
    );
  }

  @bind
  private handleAddressInputAddOptionClick() {
    const {
      savedWithdrawalAddresses, currencyCode, translate: t,
      setNotification,
    } = this.props;
    if (currencyCode) {
      const savedAddressesForCurrency = savedWithdrawalAddresses[currencyCode];
      const isMaxSavedAddressesLimitReached = savedAddressesForCurrency
        ? savedAddressesForCurrency.length === maxSavedWithdrawalAddresses
        : false;
      if (!isMaxSavedAddressesLimitReached) {
        this.props.change(fieldNames.address, '');
        this.setState(() => ({
          areNewAddressFieldsShown: true,
          isWithdrawAddressFieldDisabled: true,
        }));
      } else {
        setNotification({
          kind: 'error',
          text: t('BALANCE:WITHDRAW-COINS-DIALOG:SAVED-ADDRESSES-LIMIT-REACHED', {
            max: String(maxSavedWithdrawalAddresses),
          }),
        });
      }
    }
  }

  @bind
  private handleAvailableBalanceValueClick() {
    const { availableBalance, change, currencyCode, assetsInfo } = this.props;
    if (currencyCode && availableBalance) {
      const accuracy = currencyCode in assetsInfo ? assetsInfo[currencyCode].scale : 2;
      const amountResult = this.calculateAmount(availableBalance);
      change(fieldNames.amount, floorFloat(amountResult, accuracy).toNumber());
    }
  }

  @bind
  private handleSavedAddressDelete(address: ISavedWithdrawalAddress) {
    const { currencyCode } = this.props;
    if (currencyCode) {
      this.props.deleteWithdrawalAddress({ currencyCode, address });
    }
  }

  @bind
  private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { withdrawCoins, handleSubmit, currencyCode, saveWithdrawalAddress } = this.props;
    if (currencyCode) {
      handleSubmit(({ address, memo, amount, newAddress, newAddressLabel }: IWithdrawCoinsFormData) => {
        if (newAddress && currencyCode) {
          saveWithdrawalAddress({
            currencyCode,
            address: {
              [newAddressLabel]: newAddress,
            },
          });
        }

        const withdrawalAddress = newAddress || (
          typeof address === 'string'
            ? address
            : Object.values(address)[0]
        );
        withdrawCoins({
          transferId: `${transferIdPrefixes.withdrawal}-${uuid()}`,
          assetId: currencyCode,
          amount: +amount,
          address: withdrawalAddress,
          memo,
        });
      })(e);
    } else {
      console.error('currency code is not initialized on withdraw coins submit');
    }
  }

  @bind
  private calculateAmount(value: number): number {
    const { assetsInfo, currencyCode } = this.props;
    if (currencyCode) {
      const { withdrawalFee = 0 } = assetsInfo[currencyCode];
      const result = new Decimal(value).sub(new Decimal(withdrawalFee));
      return result.isNegative() ? 0 : result.toNumber();
    } else {
      console.error('currency code is not initialized on withdraw amount calculation');
      return 0;
    }
  }

  @bind
  private calculateTotal(value: string | null | undefined): string {
    const { assetsInfo, currencyCode } = this.props;
    if (currencyCode) {
      const { withdrawalFee = 0 } = assetsInfo[currencyCode];
      return value
        ? new Decimal(value).plus(new Decimal(withdrawalFee)).toString()
        : ' ';
    } else {
      console.error('currency code is not initialized on withdraw total calculation');
      return ' ';
    }
  }

  @bind
  private validateWithdrawalAmount(value: string | undefined = ''): string | undefined {
    const { availableBalance, translate: t } = this.props;
    const amountCoins = availableBalance ? +availableBalance : 0;
    const amountResult = +this.calculateTotal(value);
    if (amountResult > amountCoins) {
      return t('BALANCE:WITHDRAW-COINS-DIALOG:WITHDRAW-AMOUNT-FIELD-ERROR');
    }
  }

  @bind
  private validateWithdrawalAddress(value: string): string | undefined {
    const { currencyCode, translate: t } = this.props;
    if (currencyCode !== null) {
      const isAddressValid = (() => {
        if (ethereumBasedAssets.includes(currencyCode.toLowerCase())) {
          return walletAddressValidator.validate(value, 'ETH', 'both');
        }

        switch (currencyCode) {
          case 'xlm':
            return validateStellarAddress(value);
          case 'eos':
            return validateEosAddress(value);
          case 'usdt':
            return walletAddressValidator.validate(value, 'BTC', 'both');
          case 'bch':
            try {
              return walletAddressValidator.validate(bchaddr.toLegacyAddress(value), 'BCH', 'both');
            } catch (error) {
              return false;
            }

          default:
            return walletAddressValidator.validate(value, currencyCode.toUpperCase(), 'both');
        }
      })();

      if (!isAddressValid) {
        return t('BALANCE:WITHDRAW-COINS-DIALOG:WITHDRAW-ADDRESS-FIELD-ERROR');
      }
    }
  }

  @bind
  private validateNewAddressLabel(value: string) {
    const { translate: t } = this.props;
    const wasNewAddressLabelSaved = this.checkIfNewAddressLabelWasSaved(value);
    const isLabelTooLong = value.length > maxNewAddressLabelLength;
    if (wasNewAddressLabelSaved) {
      return (t('BALANCE:WITHDRAW-COINS-DIALOG:LABEL-IS-SAVED-ERROR'));
    }
    if (isLabelTooLong) {
      return (t('BALANCE:WITHDRAW-COINS-DIALOG:LABEL-IS-TOO-LONG-ERROR', {
        max: String(maxNewAddressLabelLength),
      }));
    }
  }

  @bind
  private validateEnterWithdrawAddressField(value: string | ISavedWithdrawalAddress): string | undefined {
    if (this.state.isWithdrawAddressFieldDisabled) {
      return undefined;
    }
    const address = typeof value === 'object'
      ? Object.values(value)[0]
      : value;

    if (required(address)) {
      return (required(address));
    }
    return this.validateWithdrawalAddress(address);
  }

  @bind
  private validateNewAddressField(value: string): string | undefined {
    const { translate: t } = this.props;
    const wasNewAddressSaved = this.checkIfNewAddressWasSaved(value);
    if (wasNewAddressSaved) {
      return t('BALANCE:WITHDRAW-COINS-DIALOG:ADDRESS-IS-SAVED-ERROR');
    }
    return this.validateWithdrawalAddress(value);
  }

  private checkIfNewAddressLabelWasSaved(label: string): boolean {
    const { savedWithdrawalAddresses, currencyCode } = this.props;
    if (currencyCode) {
      const savedAddressesForCurrency = savedWithdrawalAddresses[currencyCode];
      if (savedAddressesForCurrency && savedAddressesForCurrency.length) {
        const wasNewAddressLabelSaved = savedAddressesForCurrency.some((savedAddress: ISavedWithdrawalAddress) => (
          Object.keys(savedAddress)[0] === label
        ));
        return wasNewAddressLabelSaved;
      }
    }
    return false;
  }

  private checkIfNewAddressWasSaved(address: string): boolean {
    const { savedWithdrawalAddresses, currencyCode } = this.props;
    if (currencyCode) {
      const savedAddressesForCurrency = savedWithdrawalAddresses[currencyCode];
      if (savedAddressesForCurrency) {
        const wasNewAddressSaved = savedAddressesForCurrency.some((savedAddress: ISavedWithdrawalAddress) => (
          Object.values(savedAddress)[0] === address
        ));
        return wasNewAddressSaved;
      }
    }
    return false;
  }

  @bind
  private formatValue(currencyCode: string, value: number) {
    const { assetsInfo } = this.props;
    const accuracy = currencyCode in assetsInfo ? assetsInfo[currencyCode].scale : 2;

    return `${floorFloatToFixed(+value, accuracy)} ${currencyCode}`;
  }

  @bind
  private normalizeAmount(value: string) {
    const { assetsInfo, currencyCode } = this.props;
    const accuracy = currencyCode
      ? (currencyCode in assetsInfo ? assetsInfo[currencyCode].scale : 2)
      : fractionalPartLengths.cryptocurrency;
    return normalizeFloat(value, accuracy);
  }
}

export default (
  reduxForm<IWithdrawCoinsFormData, IOwnProps>({ form: formName })(WithdrawCoins)
);
