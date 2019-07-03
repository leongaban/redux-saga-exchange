import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';
import { Icon } from 'shared/view/elements/';
import { notDraggableClassName } from 'shared/constants';
import {
  IExchangeRate, IHeaderLeftPartWithSettingsProps, IExchangeRatesSettings,
} from 'shared/types/models';
import { selectors as miniTickerDSSelectors } from 'services/miniTickerDataSource';
import { WidgetTitle } from 'shared/view/elements';
import { transformAssetName } from 'shared/helpers/converters';

import { actions, selectors } from '../../../../redux';
import './HeaderLeftPart.scss';

interface IStateProps {
  exchangeRates: IExchangeRate[];
  favorites: string[];
}

interface IDispatchProps {
  toggleMarketFavoriteStatus: typeof actions.toggleMarketFavoriteStatus;
}

interface IOwnProps extends IHeaderLeftPartWithSettingsProps<IExchangeRatesSettings> { }

type Props = IOwnProps & IDispatchProps & IStateProps;

function mapStateToProps(state: IAppReduxState): IStateProps {
  return {
    exchangeRates: miniTickerDSSelectors.selectExchangeRates(state),
    favorites: selectors.selectFavorites(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    toggleMarketFavoriteStatus: actions.toggleMarketFavoriteStatus,
  }, dispatch);
}

const b = block('exchange-rates-widget-header-left-part');

// const periodOptions: NS.IPeriodOption[] = [{
//   id: 'Minute',
//   title: '1 minute',
//   shortTitle: '1m',
// },
// {
//   id: 'Minute_5',
//   title: '5 minutes',
//   shortTitle: '5m',
// },
// {
//   id: 'Minute_15',
//   title: '15 minutes',
//   shortTitle: '15m',
// },
// {
//   id: 'Minute_30',
//   title: '30 minutes',
//   shortTitle: '30m',
// },
// {
//   id: 'Hour',
//   title: '1 hour',
//   shortTitle: '1h',
// },
// {
//   id: 'Hour_2',
//   title: '2 hour',
//   shortTitle: '2h',
// },
// {
//   id: 'Hour_4',
//   title: '4 hours',
//   shortTitle: '4h',
// },
// {
//   id: 'Hour_8',
//   title: '8 hours',
//   shortTitle: '8h',
// },
// {
//   id: 'Hour_12',
//   title: '12 hours',
//   shortTitle: '12h',
// },
// {
//   id: 'Week',
//   title: '1 week',
//   shortTitle: '1w',
// },
// {
//   id: 'Day',
//   title: '1 day',
//   shortTitle: '1d',
// },
// {
//   id: 'Day_3',
//   title: '3 days',
//   shortTitle: '3d',
// },
// {
//   id: 'Month',
//   title: '1 month',
//   shortTitle: '1M',
// }];

class Header extends React.PureComponent<Props> {

  public render() {
    const { exchangeRates, settings: { currentMarketId } } = this.props;
    const currentExchangeRate = exchangeRates.find(rate => rate.market === currentMarketId);
    // const selectedPeriodOption = periodOptions.find(option => option.id === period);
    // const menuEntries = periodOptions.map(option => {
    //   return [{
    //     text: option.title,
    //     onClick: () => this.handlePeriodSelect(option),
    //   }];
    // });
    if (currentExchangeRate) {
      return (
        <div className={b()}>
          <div className={b('market')()}>
            <div
              className={b('button-toggle-favorites', { favorite: this.isMarketInFavorites(currentExchangeRate) })
                .mix(notDraggableClassName)()}
              onClick={this.handleToggleMarketFavoriteStatus}
            >
              <Icon className={b('fav-icon')()} src={require('../../../img/fav-inline.svg')} />
            </div>
            <div className={b('market-name').mix(notDraggableClassName)()}>
              <WidgetTitle textTransform="initial">
                {transformAssetName(currentExchangeRate.market.replace('_', '/'))}
              </WidgetTitle>
            </div>
          </div>
          <div className={b('period').mix(notDraggableClassName)()}>
            {/* <Menu
              entriesSections={menuEntries}
              menuPosition="left"
            >
              <div className={b('current-period')()}>
                {selectedPeriodOption ? selectedPeriodOption.title : null}
              </div>
            </Menu> */}
          </div>
        </div>
      );
    }
    return null;
  }

  @bind
  private handleToggleMarketFavoriteStatus() {
    const { settings: { currentMarketId }, toggleMarketFavoriteStatus } = this.props;
    toggleMarketFavoriteStatus(currentMarketId);
  }

  @bind
  private isMarketInFavorites(record: IExchangeRate) {
    const { favorites } = this.props;
    return R.contains(record.market, favorites);
  }

  // @bind
  // private handlePeriodSelect(option: NS.IPeriodOption) {
  //   const { onSettingsSave, currentMarketId } = this.props;
  //   onSettingsSave({ period: option.id, currentMarketId });
  // }
}

export default connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(Header);
