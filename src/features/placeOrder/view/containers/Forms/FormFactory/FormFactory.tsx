import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps, formValueSelector, Validator, FormErrors } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Decimal } from 'decimal.js';
import { Dispatch, connect } from 'react-redux';
import { bind } from 'decko';

import { Button, IButtonProps, Error, Tooltip } from 'shared/view/elements';
import { required, moreThan, moreOrEqualThan } from 'shared/helpers/validators';
import { normalizeFloat } from 'shared/helpers/normalizers';
import { floorFloat, floorFloatToFixed, replaceIfNaN } from 'shared/helpers/number';
import { IAppReduxState } from 'shared/types/app';
import { OrderType, ICurrencyPair, ITradeOrders, IPlaceOrderFormData } from 'shared/types/models';
import { Action } from 'shared/types/redux';
import { INumberFieldProps, NumberField } from 'shared/view/redux-form';
import { TranslateFunction } from 'services/i18n/namespace';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { selectors as orderBookDSSelectors } from 'services/orderBookDataSource';
import { selectors as miniTickerDataSourceSelectors } from 'services/miniTickerDataSource';
import { ClientDeviceContext, actions as configActions, selectors as configSelectors } from 'services/config';
import { transformAssetName } from 'shared/helpers/converters';
import { ClientDeviceType } from 'shared/types/ui';
import { ModalCancel } from 'shared/view/components';

import { PlaceOrderFormEntry } from '../../../../redux/data/reduxFormEntries';
import { OrderInfo, VolumeSlider } from '../../../components';
import * as NS from '../../../../namespace';
import { actions, selectors } from '../.././../../redux';
import { maxPriceLength } from './constants';
import { calculateVolume, calculateTotal, shouldShowLimitOrderPriceWarning } from '../../../../helpers';
import './FormFactory.scss';

interface IPlaceOrderFormModel {
  actionTextI18nKey: string;
  buttonLabelI18nKey: string;
  buttonColor: IButtonProps['color'];
  formType: NS.FormType;
  formEntry: PlaceOrderFormEntry;
}

interface IContentElement {
  kind: string;
  value: JSX.Element | null;
}

interface IState {
  isPriceTooltipShown: boolean;
  isLimitOrderWarningModalShown: boolean;
  isMarketOrderWarningModalShown: boolean;
}

interface IOwnProps {
  orderType: OrderType;
  balance: string;
  translate: TranslateFunction;
  currencyPair: ICurrencyPair;
}

interface IActionProps {
  placeOrder: Action<NS.IPlaceOrder>;
  setVolumeSliderValue: Action<NS.ISetVolumeSliderValue>;
  resetForm: Action<NS.IResetForm>;
  setFormPriceUpdate: Action<NS.ISetFormPriceUpdate>;
  saveUserConfig: typeof configActions.saveUserConfig;
}

interface IStateProps {
  currentLow: number;
  currentHigh: number;
  orders: ITradeOrders;
  price: string | undefined;
  volume: string | undefined;
  localFormState: NS.IPlaceOrderLocalFormState;
  isPlaceOrderRequesting: boolean;
  isFormPriceUpdateEnabled: boolean;
  convertQuoteCurrencyToUSDT: CurrencyConverter;
  commonCalculateVolumeOptions: NS.ICommonCalculateVolumeOptions;
  currentMarketPrice: number;
  shouldOpenMarketOrderWarningModal: boolean;
}

type IProps = IOwnProps & IStateProps & IActionProps & InjectedFormProps<IPlaceOrderFormData, IOwnProps>;

const makeInsufficientFundsMessage = (tradeAction: string, maxAmount: string, currency: string) =>
  `Insufficient funds to ${tradeAction} more than ${maxAmount} ${currency}`;

type RenderField = (name: string, id: string, placeholder: string, validators: Validator[]) => JSX.Element;

const moreThanZero = moreThan('Should be more than 0', 0);

const b = block('place-order-form');

function placeOrderFormFactory(model: IPlaceOrderFormModel) {
  const {
    actionTextI18nKey, formEntry: { name: formName, fieldNames }, buttonColor, buttonLabelI18nKey, formType,
  } = model;

  function mapState(state: IAppReduxState, { currencyPair }: IOwnProps): IStateProps {
    const selectFormField = formValueSelector(formName);
    // TODO fix selectBalance. It duplicates here and in Content container of place order
    return {
      currentLow: orderBookDSSelectors.selectMinAskPrice(state),
      currentHigh: orderBookDSSelectors.selectMaxBidPrice(state),
      orders: orderBookDSSelectors.selectOrders(state),
      price: selectFormField(state, fieldNames.price),
      volume: selectFormField(state, fieldNames.volume),
      localFormState: selectors.selectPlaceOrderLocalFormState(state, formName),
      isPlaceOrderRequesting: selectors.selectCommunicationPlaceOrder(state).isRequesting,
      isFormPriceUpdateEnabled: selectors.selectFormPriceUpdate(state, formType),
      convertQuoteCurrencyToUSDT: miniTickerDataSourceSelectors.selectQuoteCurrencyToUSDTConverter(
        state, currencyPair.counterCurrency
      ),
      currentMarketPrice: miniTickerDataSourceSelectors.selectCurrentMarketPrice(
        state, currencyPair.id,
      ),
      commonCalculateVolumeOptions: selectors.makeCommonOptionsForCalculateVolumeSelector(currencyPair)(state),
      shouldOpenMarketOrderWarningModal: configSelectors.selectShouldOpenMarketOrderWarningModal(state),
    };
  }

  function mapDispatch(dispatch: Dispatch<any>) {
    return bindActionCreators({
      placeOrder: actions.placeOrder,
      setVolumeSliderValue: actions.setVolumeSliderValue,
      resetForm: actions.resetForm,
      setFormPriceUpdate: actions.setFormPriceUpdate,
      saveUserConfig: configActions.saveUserConfig,
    }, dispatch);
  }

  class PlaceOrderForm extends React.PureComponent<IProps, IState> {
    public state: IState = {
      isPriceTooltipShown: false,
      isLimitOrderWarningModalShown: false,
      isMarketOrderWarningModalShown: false,
    };

    public componentWillReceiveProps(nextProps: IProps) {
      const {
        currentLow, currentHigh, currencyPair, setFormPriceUpdate,
        isFormPriceUpdateEnabled, initialize,
      } = nextProps;
      const {
        currentLow: prevLow, currentHigh: prevHigh, change,
        currencyPair: prevCurrencyPair, resetForm,
      } = this.props;

      const { priceScale } = currencyPair;

      if (prevCurrencyPair.id !== currencyPair.id) {
        initialize({ price: floorFloatToFixed(0, priceScale) });
        resetForm(formName);
        setFormPriceUpdate({ formType, isPriceUpdateEnabled: true });
      }

      if (isFormPriceUpdateEnabled && (prevLow !== currentLow || prevHigh !== currentHigh)) {
        const priceValue = formType === 'buy' ? currentLow : currentHigh;
        change(fieldNames.price, floorFloatToFixed(priceValue, priceScale));
      }
    }

    public render() {
      const { currencyPair, error, orderType } = this.props;

      return (
        <ClientDeviceContext.Consumer >
          {device => {

            const priceLabeledInput = orderType !== 'Market'
              ? this.renderLabeledInput(
                'PRICE',
                device === 'mobile' ? `≈ ${this.getConvertedPrice()}` : null,
                fieldNames.price,
                `${formName}-${fieldNames.price}`,
                [moreThanZero],
                this.makePriceFieldRenderer(currencyPair.counterCurrency, device),
                this.handlePriceFieldFocus,
                this.handlePriceFieldBlur,
              )
              : null;

            const volumeLabeledInput = this.renderLabeledInput(
              'VOLUME',
              null,
              fieldNames.volume,
              `${formName}-${fieldNames.volume}`,
              [moreThanZero, this.validateMinTradeAmount, this.validateVolume],
              this.makeVolumeFieldRenderer(
                currencyPair.baseCurrency,
                this.handleVolumeFieldChange,
                device
              ),
            );

            const contentElements: IContentElement[] = [
              { kind: 'price', value: priceLabeledInput },
              { kind: 'volume', value: volumeLabeledInput },
              { kind: 'slider', value: this.renderSlider() },
              { kind: 'order-info', value: orderType === 'Limit' ? this.renderOrderInfo() : null },
            ];
            return (
              <form className={b()} onSubmit={this.handleFormSubmit}>
                {device === 'desktop' && this.renderTitle()}
                <div className={b('content')()}>
                  {contentElements.map(this.renderContentElement)}
                </div>
                {error && <Error withIcon>{error}</Error>}
                {this.renderFooter()}
                {this.renderLimitOrderPriceWarningModal()}
                {this.renderMarketOrderWarningModal()}
              </form>
            );
          }}
        </ClientDeviceContext.Consumer>
      );
    }

    @bind
    private renderContentElement({ kind, value }: IContentElement) {
      return value && (
        <div key={kind} className={b('content-element', { kind })()}>
          {value}
        </div>
      );
    }

    private renderOrderInfo() {
      const { orders, orderType, currencyPair, volume = 0, price = 0 } = this.props;
      return (
        <div className={b('order-info')()}>
          <OrderInfo
            currencyPair={currencyPair}
            formType={formType}
            volume={replaceIfNaN(+volume)}
            price={replaceIfNaN(+price)}
            orders={orders}
            orderType={orderType}
          />
        </div>
      );
    }

    private renderSlider() {
      const { localFormState: { volumeSliderValue } } = this.props;
      return (
        <div className={b('labeled-field')()}>
          <div className={b('slider')()}>
            <VolumeSlider onChange={this.handleSliderChange} value={volumeSliderValue} />
          </div>
        </div>
      );
    }

    private renderFooter() {
      const { translate: t, isPlaceOrderRequesting } = this.props;
      return (
        <div className={b('footer')()}>
          {this.renderAvailableBalance()}
          <div className={b('submit-button')()}>
            <Button
              disabled={isPlaceOrderRequesting}
              isShowPreloader={isPlaceOrderRequesting}
              color={buttonColor}
              size="large"
            >
              {t(buttonLabelI18nKey)}
            </Button>
          </div>
        </div>
      );
    }

    @bind
    private renderLimitOrderPriceWarningModal() {
      const { isLimitOrderWarningModalShown } = this.state;
      const { translate: t } = this.props;
      return isLimitOrderWarningModalShown && (
        <ModalCancel
          isOpen={isLimitOrderWarningModalShown}
          title={t('PLACE-ORDER:ORDER-WARNING-MODAL-TITLE')}
          modalText={t(`PLACE-ORDER:LIMIT-ORDER-PRICE-${formType.toUpperCase()}-WARNING-TEXT`)}
          confirmButtonLabel={t('PLACE-ORDER:PLACE-ORDER-BUTTON-LABEL')}
          onCancel={this.handleLimitOrderWarningModalCancel}
          onConfirm={this.handleLimitOrderWarningConfirm}
        />
      );
    }

    @bind
    private renderMarketOrderWarningModal() {
      const { isMarketOrderWarningModalShown } = this.state;
      const { translate: t, shouldOpenMarketOrderWarningModal } = this.props;
      return shouldOpenMarketOrderWarningModal && isMarketOrderWarningModalShown && (
        <ModalCancel
          isOpen={isMarketOrderWarningModalShown}
          title={t('PLACE-ORDER:ORDER-WARNING-MODAL-TITLE')}
          modalText={t('PLACE-ORDER:MARKET-ORDER-WARNING-TEXT')}
          dontShowModalCheckboxLabel={t('PLACE-ORDER:MARKET-ORDER-WARNING-DONT-SHOW-CHECKBOX-LABEL')}
          onCancel={this.handleMarketOrderWarningModalCancel}
          onConfirm={this.handleMarketOrderWarningModalConfirm}
        />
      );
    }

    private renderTitle() {
      const { translate: t, currencyPair } = this.props;
      return (
        <div className={b('title')()}>
          {`${t(actionTextI18nKey)} ${transformAssetName(currencyPair.baseCurrency)}`}
        </div>
      );
    }

    @bind
    private validateVolume(volume: string | undefined, allValues: any) {
      const { currencyPair: { baseCurrency, amountScale }, commonCalculateVolumeOptions } = this.props;
      const price: string | undefined = allValues[fieldNames.price];
      const calculatedVolume = calculateVolume({
        ...commonCalculateVolumeOptions,
        balancePercentage: 100,
        formType,
        price,
      });
      const maxVolume = new Decimal(calculatedVolume);
      const roundedMaxVolume = maxVolume.toFixed(amountScale, Decimal.ROUND_DOWN);
      switch (formType) {
        case 'buy': {
          if (price !== undefined && volume !== undefined) {
            if (maxVolume.lessThan(volume)) {
              return makeInsufficientFundsMessage('buy', roundedMaxVolume, baseCurrency);
            }
          }
          return void 1;
        }
        case 'sell': {
          if (volume !== undefined && maxVolume.lessThan(volume)) {
            return makeInsufficientFundsMessage('sell', roundedMaxVolume, baseCurrency);
          }
        }
        default:
          return '';
      }
    }

    @bind
    private handleSliderChange(value: number) {
      const {
        price, currencyPair, setVolumeSliderValue, change, commonCalculateVolumeOptions,
      } = this.props;

      const { amountScale } = currencyPair;

      const calculatedVolume = calculateVolume({
        ...commonCalculateVolumeOptions,
        balancePercentage: value,
        formType,
        price
      });
      change(fieldNames.volume, floorFloat(calculatedVolume, amountScale).toString());

      setVolumeSliderValue({ form: formName, value });
    }

    @bind
    private handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
      const { handleSubmit, price = 0, currentMarketPrice, orderType, shouldOpenMarketOrderWarningModal } = this.props;
      e.preventDefault();
      handleSubmit((formData) => {
        switch (orderType) {
          case 'Limit':
            if (shouldShowLimitOrderPriceWarning(+price, currentMarketPrice, formType)) {
              this.setState({ isLimitOrderWarningModalShown: true });
            } else {
              this.placeOrder(formData);
            }
            break;
          case 'Market':
            if (shouldOpenMarketOrderWarningModal) {
              this.setState({ isMarketOrderWarningModalShown: true });
            } else {
              this.placeOrder(formData);
            }
            break;
        }
      })(e);
    }

    @bind
    private placeOrder(formData: IPlaceOrderFormData) {
      const { currencyPair, orderType, placeOrder } = this.props;
      placeOrder({
        formName,
        amount: formData.volume,
        instrument: currencyPair.id,
        // TODO remove condition with "Conditional" later
        isLimit: orderType === 'Limit' || orderType === 'Conditional',
        loanRate: 1,
        orderSide: formType,
        price: orderType === 'Market'
          ? '0'
          : formData.price,
        rateStop: 1,
      });
    }

    @bind
    private handleLimitOrderWarningModalCancel() {
      this.setState({ isLimitOrderWarningModalShown: false });
    }

    @bind
    private handleLimitOrderWarningConfirm() {
      this.setState({ isLimitOrderWarningModalShown: false });
      this.props.handleSubmit(this.placeOrder)();
    }

    @bind
    private handleMarketOrderWarningModalConfirm(dontShowModal?: boolean) {
      const { handleSubmit, saveUserConfig } = this.props;
      this.setState({ isMarketOrderWarningModalShown: false });
      handleSubmit(this.placeOrder)();
      if (dontShowModal) {
        saveUserConfig({ shouldOpenMarketOrderWarningModal: false });
      }
    }

    @bind
    private handleMarketOrderWarningModalCancel() {
      this.setState({ isMarketOrderWarningModalShown: false });
    }

    private renderAvailableBalance() {
      const { translate: t, balance } = this.props;
      return (
        <div className={b('balance')()}>
          <div className={b('balance-label')()}>
            {t('ORDERS:PLACE-ORDER-FORM:BALANCE-LABEL')}
          </div>
          <div className={b('balance-value')()}>
            {balance}
          </div>
        </div>
      );
    }

    @bind
    private handleVolumeFieldChange() {
      const { setVolumeSliderValue } = this.props;
      setVolumeSliderValue({ form: formName, value: 0 });
    }

    @bind
    private getConvertedPrice() {
      const { convertQuoteCurrencyToUSDT, price } = this.props;
      const convertedPrice = price ? convertQuoteCurrencyToUSDT(price) : null;
      return convertedPrice
        ? `$ ${convertedPrice}`
        : '$ 0';
    }

    private makePriceFieldRenderer(unit: string, device: ClientDeviceType) {
      const { currencyPair: { priceScale } } = this.props;
      return (name: string, id: string, placeholder: string, validators: Validator[]) => {

        const numberField = (
          <Field<INumberFieldProps>
            unit={transformAssetName(unit)}
            step={Math.pow(10, -priceScale)}
            accuracy={priceScale}
            name={name}
            id={id}
            validate={[required, ...validators]}
            component={NumberField}
            normalize={this.priceNormalizer}
            placeholder={placeholder}
          />
        );

        return device === 'desktop'
          ? (
            <Tooltip
              text={this.getConvertedPrice()}
              position="top-left"
              withPointer
              isShown={this.state.isPriceTooltipShown}
            >
              {numberField}
            </Tooltip>
          )
          : numberField;
      };
    }

    private makeVolumeFieldRenderer(
      unit: string,
      handleChange: () => void,
      device: ClientDeviceType,
    ) {
      return (name: string, id: string, placeholder: string, validators: Validator[]) => {
        const {
          price, currencyPair, commonCalculateVolumeOptions, orderType,
        } = this.props;
        const { amountScale } = currencyPair;
        const calculatedVolume = calculateVolume({
          ...commonCalculateVolumeOptions,
          balancePercentage: 100,
          formType,
          price,
        });
        const maxAmount = ((orderType === 'Market' || price && +price > 0) && +calculatedVolume > 0)
          ? (new Decimal(calculatedVolume)).toFixed(amountScale, Decimal.ROUND_DOWN)
          : '—';

        return (
          <>
            <Field<INumberFieldProps>
              dropdownText={device === 'desktop' ? `Max Amount ${maxAmount}` : void 0}
              dropdownValue={device === 'desktop' ? maxAmount : void 0}
              max={Number(maxAmount)}
              step={Math.pow(10, -amountScale)}
              accuracy={amountScale}
              unit={transformAssetName(unit)}
              name={name}
              id={id}
              validate={[required, ...validators]}
              component={NumberField}
              normalize={this.amountNormalizer}
              placeholder={placeholder}
              onChange={handleChange}
            />
            {device === 'mobile' && (
              <span className={b('max-amount')()} onClick={this.makeMaxAmountClickHandler(maxAmount)}>
                Max Amount {maxAmount}
              </span>
            )}
          </>
        );
      };
    }

    @bind
    private makeMaxAmountClickHandler(maxAmount: string) {
      return () => this.props.change(fieldNames.volume, maxAmount);
    }

    private renderLabeledInput(
      i18nFieldSuffix: string,
      subLabelText: string | null,
      name: string,
      id: string,
      validators: Validator[],
      renderField: RenderField,
      onFocus?: () => void,
      onBlur?: () => void,
    ) {
      const { translate: t } = this.props;
      return (
        <div className={b('labeled-field')()} onFocus={onFocus} onBlur={onBlur}>
          <label htmlFor={id} className={b('labeled-field-label')()}>
            {t(`ORDERS:PLACE-ORDER-FORM:${i18nFieldSuffix}-FIELD-LABEL`)}
            <span className={b('labeled-field-sublabel')()}>{subLabelText}</span>
          </label>
          <div className={b('labeled-field-input')()}>
            {renderField(name, id, t(`ORDERS:PLACE-ORDER-FORM:${i18nFieldSuffix}-FIELD-PLACEHOLDER`), validators)}
          </div>
        </div>
      );
    }

    @bind
    private handlePriceFieldFocus() {
      const { setFormPriceUpdate } = this.props;
      setFormPriceUpdate({ formType, isPriceUpdateEnabled: false });
      this.setState(() => ({
        isPriceTooltipShown: true,
      }));
    }

    @bind
    private handlePriceFieldBlur() {
      this.setState(() => ({
        isPriceTooltipShown: false,
      }));
    }

    @bind
    private amountNormalizer(value: string) {
      const { currencyPair: { amountScale } } = this.props;
      return normalizeFloat(value, amountScale);
    }

    @bind
    private priceNormalizer(value: string) {
      const { currencyPair: { priceScale } } = this.props;
      return value.length > maxPriceLength
        ? value.slice(0, -1)
        : normalizeFloat(value, priceScale);
    }

    @bind
    private validateMinTradeAmount(value: string | undefined) {
      const { currencyPair: { minTradeAmount } } = this.props;
      return moreOrEqualThan(`Minimum trade amount is ${minTradeAmount}`, minTradeAmount, value);
    }
  }

  const validateForm = (allValues: IPlaceOrderFormData, props: IProps): FormErrors<IPlaceOrderFormData> => {
    const { currencyPair: { minOrderValue }, orderType } = props;
    if (orderType === 'Limit') {
      const price = allValues[fieldNames.price];
      const volume = allValues[fieldNames.volume];
      const total = calculateTotal(volume, price);
      const totalErrorMessage = `Total is expected to be more than or equal to ${minOrderValue}`;
      return {
        _error: total !== undefined
          ? moreOrEqualThan(totalErrorMessage, minOrderValue, String(total))
          : void 0,
      } as any;
    }
    return {};
  };

  return reduxForm<IPlaceOrderFormData, IOwnProps>({
    form: formName,
    validate: validateForm,
  })(
    connect<IStateProps, IActionProps, IOwnProps>(mapState, mapDispatch)(
      PlaceOrderForm,
    ),
  );
}

export default placeOrderFormFactory;
