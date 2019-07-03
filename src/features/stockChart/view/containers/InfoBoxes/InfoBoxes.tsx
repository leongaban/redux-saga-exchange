import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate, ICurrencyPair } from 'shared/types/models';
import { floorFloatToFixed } from 'shared/helpers/number';
import { selectors as miniTickerDSSelectors } from 'services/miniTickerDataSource';
import { transformAssetName } from 'shared/helpers/converters';

import { hourInterval } from '../../../constants';
import './InfoBoxes.scss';

interface IStateProps {
  currentMiniTick?: IExchangeRate;
}

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
  vertical?: boolean;
  withBoldValues?: boolean;
}

type IProps = IOwnProps & IStateProps;

function mapStateToProps(state: IAppReduxState, ownProps: IOwnProps): IStateProps {
  return {
    currentMiniTick: miniTickerDSSelectors.selectCurrentMarketTick(state, ownProps.currentCurrencyPair.id),
  };
}

const b = block('info-boxes');

class InfoBoxes extends React.PureComponent<IProps> {
  public render() {
    const { currentMiniTick, currentCurrencyPair: { baseCurrency }, vertical, withBoldValues } = this.props;
    const { changeAbsolute = 0, changePercent = 0, high = 0, low = 0, volume = 0 } = currentMiniTick
      ? currentMiniTick
      : {} as IExchangeRate;
    return (
      <ul className={b({ vertical: !!vertical })()}>
        <li className={b('info-box', { up: changeAbsolute <= 0, down: changeAbsolute > 0 })()}>
          <div className={b('caption')()}>
            {hourInterval} Change
              </div>
          <div className={b('value', { bold: !!withBoldValues })()}>
            <div className={b('change')()}>
              {this.formatPrice(changeAbsolute)} {isNaN(changePercent) ? '0' : floorFloatToFixed(changePercent, 2)} %
            </div>
          </div>
        </li>
        <li className={b('info-box')()}>
          <div className={b('caption')()}>
            {hourInterval} Volume {transformAssetName(baseCurrency)}
          </div>
          <div className={b('value', { bold: !!withBoldValues })()}>
            {this.formatVolume(volume)}
          </div>
        </li>
        <li className={b('info-box')()}>
          <div className={b('caption')()}>
            {hourInterval} High
              </div>
          <div className={b('value', { bold: !!withBoldValues })()}>
            {this.formatPrice(high)}
          </div>
        </li>
        <li className={b('info-box')()}>
          <div className={b('caption')()}>
            {hourInterval} Low
              </div>
          <div className={b('value', { bold: !!withBoldValues })()}>
            {this.formatPrice(low)}
          </div>
        </li>
      </ul>
    );
  }

  private formatPrice(value: number) {
    const { currentCurrencyPair: { priceScale } } = this.props;
    return floorFloatToFixed(value, priceScale);
  }

  private formatVolume(value: number) {
    const accuracy = value > 100 ? 2 : 4;
    return floorFloatToFixed(value, accuracy);
  }
}

export default connect<IStateProps>(mapStateToProps)(InfoBoxes);
