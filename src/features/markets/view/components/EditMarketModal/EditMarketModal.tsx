import React from 'react';
import { Button, Modal, InputControl } from 'shared/view/elements';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps, Form } from 'redux-form';

import { required, lessOrEqualThan } from 'shared/helpers/validators';
import { normalizeFloat, normalizeInteger } from 'shared/helpers/normalizers';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { IMarket } from 'shared/types/models';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { reduxFormEntries } from '../../../redux';
import * as NS from '../../../namespace';
import './EditMarketModal.scss';

const { editMarketFormEntry: { name, fieldNames } } = reduxFormEntries;

const b = block('edit-market');

interface IOwnProps {
  isModalOpen: boolean;
  market: IMarket | null;
  onClose(): void;
}

type IProps = IOwnProps & InjectedFormProps<NS.IEditMarketForm, IOwnProps> & ITranslateProps;

const InputFieldWrapper = Field as new () => Field<IInputFieldProps>;

class NewMarket extends React.PureComponent<IProps> {

  private lessOrEqualThanTen = lessOrEqualThan(
    this.props.translate('SHARED:ERROR:LESS-OR-EQUAL-THAN', { value: '10' }),
    10,
  );

  public componentDidMount() {
    const { market } = this.props;
    if (market !== null) {
      this.initialForm(market);
    }
  }
  public render() {
    const { isModalOpen, handleSubmit, onClose, market, translate: t } = this.props;
    const title = t('ADMIN:MARKETS:EDIT-MARKET-MODAL-TITLE', { market: market !== null ? market.name : '' });
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={onClose}
        hasCloseCross={true}
        title={title}
      >
        <Form className={b()} onSubmit={handleSubmit} >
          <InputControl label={t('ADMIN:MARKETS:ORDER-MAKER-FEE')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.makerFee}
              validate={[required]}
              normalize={this.normalizeFloat}
              autoFocus
            />
          </InputControl>
          <InputControl label={t('ADMIN:MARKETS:ORDER-TAKER-FEE')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.takerFee}
              validate={[required]}
              normalize={this.normalizeFloat}
            />
          </InputControl>
          <InputControl label={t('ADMIN:MARKETS:QUOTE-SCALE')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.priceScale}
              validate={[required, this.lessOrEqualThanTen]}
              normalize={normalizeInteger}
            />
          </InputControl>
          <InputControl label={t('ADMIN:MARKETS:BASE-SCALE')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.amountScale}
              validate={[required, this.lessOrEqualThanTen]}
              normalize={normalizeInteger}
            />
          </InputControl>
          <InputControl label={t('ADMIN:MARKETS:MIN-TRADE-AMOUNT')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.minTradeAmount}
              validate={[required]}
            />
          </InputControl>
          <InputControl label={t('ADMIN:MARKETS:MIN-ORDER-VALUE')}>
            <InputFieldWrapper
              component={InputField}
              name={fieldNames.minOrderValue}
              validate={[required]}
            />
          </InputControl>
          <div className={b('controls')()}>
            <div className={b('button')()}>
              <Button size="large" type="submit" >
                {t('SHARED:BUTTONS:SAVE')}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  @bind
  private normalizeFloat(value: string) {
    return normalizeFloat(value, 4);
  }

  @bind
  private initialForm(market: IMarket) {
    const { id, makerFee, takerFee, priceScale, amountScale, minOrderValue, minTradeAmount } = market;
    this.props.initialize({
      id,
      makerFee: String(makerFee),
      takerFee: String(takerFee),
      priceScale: String(priceScale),
      amountScale: String(amountScale),
      minOrderValue: String(minOrderValue),
      minTradeAmount: String(minTradeAmount),
    });
  }
}

export default reduxForm<NS.IEditMarketForm, IOwnProps>({
  form: name,
})(i18nConnect(NewMarket));
