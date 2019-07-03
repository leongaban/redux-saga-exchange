import { Field } from 'redux-form';
import * as React from 'react';
import { connect } from 'react-redux';

import { SelectField, ISelectFieldProps } from 'shared/view/redux-form';
import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate } from 'shared/types/models';
import { selectors as miniTickerDSSelectors } from 'services/miniTickerDataSource';

interface IStateProps {
  exchangeRates: IExchangeRate[];
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    exchangeRates: miniTickerDSSelectors.selectExchangeRates(state),
  };
}

const SelectMarketField = Field as new () => Field<ISelectFieldProps<IExchangeRate>>;

interface IOwnProps {
  name: string;
}

type IProps = IOwnProps & IStateProps;

class ExchangeRatesSelectField extends React.PureComponent<IProps> {
  public render() {
    const { name, exchangeRates } = this.props;
    return (
      <SelectMarketField
        name={name}
        component={SelectField}
        options={exchangeRates}
        optionValueKey={this.getOptionValue}
      />
    );
  }

  private getOptionValue(x: IExchangeRate) {
    return x.market;
  }
}

export default (
  connect(mapState, () => ({}))(
    ExchangeRatesSelectField,
  ));
