import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';

import { ILastPrice, OrderBookWidgetType } from 'shared/types/models';
import { IAppReduxState, Omit } from 'shared/types/app';
import { floorFloatToFixed } from 'shared/helpers/number';
import { Icon } from 'shared/view/elements';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import { selectors as miniTickerDataSourceSelectors } from 'services/miniTickerDataSource';

import { selectors } from '../../../redux';
import './LastPrice.scss';

interface IStateProps {
  lastPrice: ILastPrice | null;
  convertQuoteCurrencyToUSDT: CurrencyConverter;
}

interface IOwnProps {
  accuracy: number;
  counterCurrency: string;
  widgetType: OrderBookWidgetType;
}

type IProps = IOwnProps & IStateProps;

function mapState(state: IAppReduxState, { counterCurrency }: IOwnProps): IStateProps {
  return {
    lastPrice: selectors.selectLastPrice(state),
    convertQuoteCurrencyToUSDT: miniTickerDataSourceSelectors.selectQuoteCurrencyToUSDTConverter(
      state, counterCurrency
    ),
  };
}

const arrows: Omit<Record<ILastPrice['change'], string>, 'unchanged'> = {
  increased: require('./img/top-inline.svg'),
  decreased: require('./img/bottom-inline.svg'),
};

const b = block('last-price');

class LastPrice extends React.PureComponent<IProps> {

  public render() {
    const { lastPrice, convertQuoteCurrencyToUSDT, accuracy, widgetType } = this.props;
    const convertedLastPrice = lastPrice && convertQuoteCurrencyToUSDT(lastPrice.value);
    return (
      <div className={b({ 'widget-type': widgetType })()}>
        {lastPrice !== null
          ? (
            <>
              <div className={b('value', { change: lastPrice.change })()}>
                {floorFloatToFixed(lastPrice.value, accuracy)}
                {lastPrice.change !== 'unchanged' && <Icon src={arrows[lastPrice.change]} className={b('arrow')()} />}
              </div>
              <div className={b('converted-value')()}>
                {convertedLastPrice !== null ? `$ ${convertedLastPrice}` : ' - '}
              </div>
            </>
          ) : ' - '
        }
      </div>
    );
  }
}

export default (
  connect(mapState, () => ({}))(
    LastPrice,
  )
);
