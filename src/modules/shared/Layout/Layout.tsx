import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as features from 'features';
import routes from 'modules/routes';
import featureConnect from 'core/FeatureConnector';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { TranslateFunction } from 'services/i18n/namespace';

import { Icon, Tooltip } from 'shared/view/elements';
import { IRoutable, IAppReduxState } from 'shared/types/app';
import { IUser, IAssetsInfoMap } from 'shared/types/models';
import { floorFloatToFixed, formatDecimalIfLarge } from 'shared/helpers/number';
import { UITheme } from 'shared/types/ui';
import { IMenuEntry, Menu } from 'shared/view/components';
import { actions as configActions, selectors as configSelectors } from 'services/config/redux';
import { selectors as userSelectors } from 'services/user/redux';

import UserBar from '../UserBar/UserBar';
import ThemeMenu from '../ThemeMenu/ThemeMenu';
import './Layout.scss';

interface IFeatureProps {
  assetsFeatureEntry: features.assets.Entry;
}

interface IOwnProps {
  additionalRightPanelItem?: React.ReactNode;
}

interface IStateProps {
  uiTheme: UITheme;
  assetsInfo: IAssetsInfoMap;
  user: IUser | null;
  estimatedSumInBTC: number | null;
}

interface IActionProps {
  saveTheme: typeof configActions.saveTheme;
}

function mapState(state: IAppReduxState, ownProps: LayoutOwnProps): IStateProps {
  return {
    uiTheme: configSelectors.selectUITheme(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
    user: userSelectors.selectUser(state),
    estimatedSumInBTC: ownProps.assetsFeatureEntry.selectors.selectEstimatedSumInBTC(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    saveTheme: configActions.saveTheme,
  }, dispatch);
}
type LayoutOwnProps = IFeatureProps & IOwnProps & RouteComponentProps<void>;

type IProps = LayoutOwnProps & ITranslateProps & IActionProps & IStateProps;

const b = block('layout');

class Layout extends React.PureComponent<IProps> {
  public render() {
    const { children, additionalRightPanelItem, translate, uiTheme, saveTheme } = this.props;

    const pathToTrade = routes.trade.classic.getPath();

    return (
      <div className={b()}>
        <header className={b('header')()}>
          <div className={b('header-section', { align: 'left' })()}>
            <NavLink to={pathToTrade}>
              <Icon src={require('./img/logo-inline.svg')} className={b('logo')()} />
            </NavLink>
            <div className={b('header-left-panel')()}>
              {this.renderNavigationMenu()}
            </div>
          </div>
          <div className={b('header-section', { align: 'right' })()}>
            <div className={b('header-item')()}>
              {additionalRightPanelItem}
            </div>
            <div className={b('header-item')()}>
              <ThemeMenu uiTheme={uiTheme} translate={translate} saveUiTheme={saveTheme} size="small" />
            </div>
            <UserBar size="small" />
          </div>
        </header>
        {children}
      </div>
    );
  }

  @bind
  private renderNavigationMenu() {
    const { translate: t, location, user, estimatedSumInBTC, uiTheme } = this.props;
    const pathToTrade = routes.trade.classic.getPath();
    const userIsVerified = Boolean(user && user.isVerified);
    const reportsMenuEntries: IMenuEntry[][] = [
      [{
        content: t('REPORTS:SECTION-TITLE-OPEN-ORDERS'),
        onClick: () => this.redirectTo(routes.reports['open-orders']),
      }],
      [{
        content: t('REPORTS:SECTION-TITLE-ORDERS-HISTORY'),
        onClick: () => this.redirectTo(routes.reports['order-history']),
      }],
    ];
    const profileMenuEntries: IMenuEntry[][] = [
      [{
        content: (
          <div className={b('profile-menu-item')()}>
            <div className={b('profile-menu-title')()}>
              {t('LAYOUT:MENU-PROFILE:PROFILE')}
              {user && user.isVerified && (
                <Icon src={require('./img/verified-protection-inline.svg')} className={b('verified-icon')()} />
              )}
            </div>
            <div className={b('profile-menu-value')()}>
              {user && user.email}
            </div>
          </div>
        ),
        onClick: () => this.redirectTo(routes.account.profile),
      }],
      [{
        content: (
          <div className={b('profile-menu-item')()}>
            <div className={b('profile-menu-title')()}>
              {t('LAYOUT:MENU-PROFILE:ESTIMATED-VALUE')}
            </div>
            <div className={b('profile-menu-value')()}>
              {estimatedSumInBTC === null ? ' - ' : `${this.formatAmount(estimatedSumInBTC, 'btc')} BTC`}
            </div>
          </div>
        ),
        onClick: () => this.redirectTo(routes.balance),
      }],
    ];
    const profileIcon = uiTheme === 'moon'
      ? require('./img/profile-astronaut-inline.svg')
      : require('./img/profile-inline.svg');

    return (
      <div className={b('navigation-menu')()}>
        <div className={b('navigation-menu-item', { profile: uiTheme === 'moon' ? 'moon' : 'regular' })()}>
          <Menu entriesSections={profileMenuEntries} menuPosition="right" entryHeight="big">
            <Icon src={profileIcon} className={b('profile-icon')()} />
          </Menu>
        </div>
        <NavLink
          className={b('navigation-menu-item')()}
          activeClassName={b('navigation-menu-item', { active: true })()}
          to={routes.balance.getPath()}
        >
          {t('LAYOUT:MENU-BALANCE')}
        </NavLink>
        <NavLink
          className={b('navigation-menu-item')()}
          activeClassName={b('navigation-menu-item', { active: true })()}
          to={pathToTrade}
        >
          {t('LAYOUT:MENU-TRADE')}
        </NavLink>

        <a className={b('navigation-menu-item', { 'select-menu': true })()}>
          <Menu menuPosition="left" entriesSections={reportsMenuEntries}>
            <div
              className={b('reports-menu', {
                active: location.pathname.includes(routes.reports.getPath()),
              })()}
            >
              <span className={b('reports-menu-title')()}>{t('LAYOUT:MENU-REPORTS')}</span>
              <span className={b('reports-menu-arrow')()} />
            </div>
          </Menu>
        </a>

        {this.displayLiquidityPoolLink(userIsVerified, t)}

        {this.displayForexLink(userIsVerified, t)}
      </div>
    );
  }

  @bind
  private displayLiquidityPoolLink(isVerified: boolean, t: TranslateFunction) {
    return isVerified ? (
      <NavLink
        className={b('navigation-menu-item')()}
        activeClassName={b('navigation-menu-item', { active: true })()}
        to={routes['liquidity-pool'].getPath()}
      >
        {t('LAYOUT:MENU-LIQUDITIY-POOL')}
      </NavLink>
    ) : (
        <div className={b('navigation-menu-item', { disabled: true })()}>
          <Tooltip text={t('LAYOUT:MENU-LIQUIDITY-POOL:VERIFY')} position="bottom">
            {t('LAYOUT:MENU-LIQUDITIY-POOL')}
          </Tooltip>
        </div>
      );
  }

  @bind
  private displayForexLink(isVerified: boolean, t: TranslateFunction) {
    return isVerified ? (
      <NavLink
        className={b('navigation-menu-item')()}
        activeClassName={b('navigation-menu-item', { active: true })()}
        to={routes.forex.getPath()}
      >
        {t('LAYOUT:MENU-FOREX')}
      </NavLink>
    ) : (
        <div className={b('navigation-menu-item', { disabled: true })()}>
          <Tooltip text={t('LAYOUT:MENU-FOREX:VERIFY')} position="bottom">
            {t('LAYOUT:MENU-FOREX')}
          </Tooltip>
        </div>
      );
  }

  @bind
  private redirectTo(route: IRoutable) {
    this.props.history.push(route.getPath());
  }

  @bind
  private formatAmount(value: number, asset: string) {
    const { assetsInfo } = this.props;
    const accuracy = asset in assetsInfo ? assetsInfo[asset].scale : 2;
    const formattedValue = floorFloatToFixed(value, accuracy);
    return formatDecimalIfLarge(formattedValue);
  }
}

const connectedLayout = connect<IStateProps, IActionProps, LayoutOwnProps>(mapState, mapDispatch)(i18nConnect(Layout));

export default (
  withRouter(
    featureConnect({
      assetsFeatureEntry: features.assets.loadEntry,
    })(connectedLayout)
  )
);
