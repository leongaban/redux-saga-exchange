import * as React from 'react';
import { bind } from 'decko';
import * as R from 'ramda';

import { ICurrencyPair } from 'shared/types/models';
import { Select } from 'shared/view/elements';

interface IProps {
  currentCurrencyPair: ICurrencyPair;
  selected: number | null;
  onSelect(value: number): void;
  onDecimalsSave?(value: number): void;
}

class DecimalsSelect extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { onSelect } = this.props;
    onSelect(this.decimals);
  }

  public componentWillReceiveProps({ currentCurrencyPair }: IProps) {
    const { currentCurrencyPair: prevMarket } = this.props;
    if (prevMarket.id !== currentCurrencyPair.id) {
      this.handleDecimalsSelect(currentCurrencyPair.priceScale);
    }
  }

  private get decimals() {
    const { selected, currentCurrencyPair: { priceScale } } = this.props;

    return selected === null
      ? priceScale
      : Math.min(selected, priceScale);
  }

  public render() {
    const { currentCurrencyPair: { priceScale } } = this.props;
    const decimalsOptions = R.range(0, priceScale + 1);

    return (
      <Select
        options={decimalsOptions}
        optionValueKey={this.getDecimalsOptionValue}
        selectedOption={this.decimals}
        onSelect={this.handleDecimalsSelect}
      />
    );
  }

  private getDecimalsOptionValue(x: number) {
    return `${x} dec`;
  }

  @bind
  private handleDecimalsSelect(decimals: number) {
    const { onSelect, onDecimalsSave } = this.props;
    onSelect(decimals);
    if (onDecimalsSave) {
      onDecimalsSave(decimals);
    }
  }
}

export default DecimalsSelect;
