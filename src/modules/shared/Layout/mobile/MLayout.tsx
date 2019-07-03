import * as React from 'react';
import block from 'bem-cn';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import Swipeable from 'react-swipeable';

import { Icon } from 'shared/view/elements';
import { IRoutable, IAppReduxState } from 'shared/types/app';
import { IUser } from 'shared/types/models';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { UITheme } from 'shared/types/ui';
import routes from 'modules/routes';
import { actions as configActions, selectors as configSelectors } from 'services/config/redux';
import { selectors as userSelectors } from 'services/user/redux';

import { sidebarMaxWidth, sidebarTransitionDuration } from './constants';
import ThemeMenu from '../../ThemeMenu/ThemeMenu';
import UserBar from '../../UserBar/UserBar';
import './MLayout.scss';

interface ISidebarEntry {
  iconSrc: string;
  title: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick(): void;
}

interface IStateProps {
  uiTheme: UITheme;
  user: IUser | null;
  isUserAuthorized: boolean;
}

interface IActionProps {
  saveTheme: typeof configActions.saveTheme;
  setTheme: typeof configActions.setTheme;
}

interface IOwnProps {
  navigationTabs?: React.ReactNode;
}

interface IState {
  sidebarLeftPosition: number;
  isContentSwipingRight: boolean;
  isOverlaySwipingLeft: boolean;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    uiTheme: configSelectors.selectUITheme(state),
    user: userSelectors.selectUser(state),
    isUserAuthorized: userSelectors.selectIsAuthorized(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    saveTheme: configActions.saveTheme,
    setTheme: configActions.setTheme,
  }, dispatch);
}

type IProps = RouteComponentProps<void> & ITranslateProps & IActionProps & IStateProps & IOwnProps;

const b = block('m-layout');

class MLayout extends React.PureComponent<IProps, IState> {
  public state: IState = {
    sidebarLeftPosition: -sidebarMaxWidth,
    isOverlaySwipingLeft: false,
    isContentSwipingRight: false,
  };

  private headerRef: HTMLElement | null;
  private contentRef: HTMLDivElement | null = null;
  private sidebarRef: HTMLDivElement | null = null;

  private get sidebarWidth() {
    return this.sidebarRef ? this.sidebarRef.offsetWidth : 0;
  }

  private get sidebarHiddenPosition() {
    return -this.sidebarWidth * 2;
  }

  private sidebarDisplayedPosition = 0;

  public componentDidMount() {
    window.addEventListener('touchmove', this.handleWindowTouchmove, { passive: false });

    this.setState(() => ({
      sidebarLeftPosition: this.sidebarHiddenPosition,
    }));

    if (this.headerRef) {
      const headerHeight = this.headerRef.offsetHeight;

      if (this.contentRef) {
        // for the sidebar swipe to work when swiping lower than the content
        this.contentRef.style.minHeight = `${window.innerHeight - this.headerRef.offsetHeight}px`;

        this.contentRef.style.paddingTop = `${headerHeight}px`;
      }

      if (this.sidebarRef) {
        this.sidebarRef.style.top = `${headerHeight}px`;
      }
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleWindowTouchmove);
  }

  public render() {
    const { children, isUserAuthorized } = this.props;
    return (
      <div className={b()}>
        {this.renderHeader()}
        {isUserAuthorized && this.renderSidebar()}
        <Swipeable
          onSwipingRight={this.handleContentSwipingRight}
          onSwiped={this.handleContentSwiped}
          innerRef={this.initContentRef}
          className={b('swipeable')()}
        >
          {children}
        </Swipeable>
      </div>
    );
  }

  private renderHeader() {
    const { translate, uiTheme, navigationTabs, isUserAuthorized } = this.props;
    return (
      <header className={b('header')()} ref={this.initHeaderRef}>
        <div className={b('header-main-content')()}>
          <div className={b('header-section', { align: 'left' })()}>
            {isUserAuthorized && (
              <div className={b('sidebar-toggle')()} onClick={this.handleSidebarToggleClick}>
                <Icon src={require('./img/sidebar-toggle-inline.svg')} className={b('sidebar-toggle-icon')()} />
              </div>
            )}
            <NavLink to={routes.trade.classic.getPath()}>
              <Icon src={require('./img/logo-inline.svg')} className={b('logo')()} />
            </NavLink>
          </div>
          <div className={b('header-section', { align: 'right' })()}>
            <div className={b('header-section-entry')()}>
              <ThemeMenu uiTheme={uiTheme} translate={translate} saveUiTheme={this.handleSaveUiTheme} size="big" />
            </div>
            {isUserAuthorized && (
              <div className={b('header-section-entry')()}>
                <UserBar size="big" />
              </div>
            )}
          </div>
        </div>
        {navigationTabs && <div className={b('navigation-tabs')()}>{navigationTabs}</div>}
      </header>
    );
  }

  private renderSidebar() {
    const { translate: t, user, location: { pathname } } = this.props;
    const { sidebarLeftPosition, isContentSwipingRight, isOverlaySwipingLeft } = this.state;
    const sidebarEntries: ISidebarEntry[] = [
      {
        iconSrc: require('./img/exchange-inline.svg'),
        title: t('LAYOUT:MENU-EXCHANGE'),
        isSelected: pathname === routes.trade.classic.getPath(),
        onClick: this.makeSidebarEntryClickHandler(routes.trade.classic),
      },
      {
        iconSrc: require('./img/balance-inline.svg'),
        title: t('LAYOUT:MENU-BALANCE'),
        isSelected: pathname === routes.balance.getPath(),
        onClick: this.makeSidebarEntryClickHandler(routes.balance),
      },
      {
        iconSrc: require('./img/reports-inline.svg'),
        title: t('LAYOUT:MENU-REPORTS'),
        isSelected: pathname === routes.reports.mobile.getPath(),
        onClick: this.makeSidebarEntryClickHandler(routes.reports.mobile),
      },
      {
        iconSrc: require('./img/profile-inline.svg'),
        title: user ? user.email : t('ACCOUNT:PROFILE-TAB-TITLE'),
        isSelected: pathname === routes.account.profile.getPath(),
        onClick: this.makeSidebarEntryClickHandler(routes.account.profile),
      },
      {
        iconSrc: require('./img/lp-inline.svg'),
        title: t('LAYOUT:MENU-LIQUDITIY-POOL'),
        isSelected: pathname === routes['liquidity-pool'].getPath(),
        isDisabled: Boolean(user && !user.isVerified),
        onClick: this.makeSidebarEntryClickHandler(routes['liquidity-pool']),
      },
      {
        iconSrc: require('./img/lp-inline.svg'),
        title: t('LAYOUT:MENU-FOREX'),
        isSelected: pathname === routes.forex.getPath(),
        isDisabled: Boolean(user && !user.isVerified),
        onClick: this.makeSidebarEntryClickHandler(routes.forex),
      },
      {
        iconSrc: require('./img/support-inline.svg'),
        title: t('LAYOUT:MENU-SUPPORT'),
        isSelected: false,
        onClick: this.handleSupportMenuEntryClick,
      },
    ];
    return (
      <React.Fragment>
        <nav
          className={b('sidebar')()}
          ref={this.initSidebarRef}
          style={{
            left: sidebarLeftPosition,
            maxWidth: sidebarMaxWidth,
            transitionDuration: isContentSwipingRight || isOverlaySwipingLeft ? '0s' : sidebarTransitionDuration,
          }}
        >
          <ul className={b('sidebar-entries')()}>
            {sidebarEntries.map((entry, i) => {
              const { isSelected, iconSrc, title, onClick, isDisabled } = entry;
              return (
                <li
                  className={b('sidebar-entry', { selected: isSelected, disabled: !!isDisabled })()}
                  onClick={isDisabled ? void 0 : onClick}
                  key={i}
                >
                  <Icon src={iconSrc} className={b('sidebar-icon')()} />
                  <span className={b('sidebar-title')()}>{title}</span>
                </li>
              );
            })}
          </ul>
        </nav>
        <Swipeable
          onSwipingLeft={this.handleOverlaySwipingLeft}
          onSwiped={this.handleOverlaySwiped}
        >
          <div
            className={b('overlay', { hidden: sidebarLeftPosition <= -this.sidebarWidth })()}
            onClick={this.handleOverlayClick}
          />
        </Swipeable>
      </React.Fragment>
    );
  }

  @bind
  private initHeaderRef(x: HTMLElement | null) {
    this.headerRef = x;
  }

  @bind
  private initContentRef(x: HTMLDivElement | null) {
    this.contentRef = x;
  }

  @bind
  private initSidebarRef(x: HTMLDivElement | null) {
    if (x) {
      this.sidebarRef = x;
    }
  }

  @bind
  private handleSaveUiTheme(theme: UITheme) {
    const { isUserAuthorized, saveTheme, setTheme } = this.props;
    if (isUserAuthorized) {
      saveTheme(theme);
    } else {
      setTheme(theme);
    }
  }

  @bind
  private handleContentSwipingRight(e: React.TouchEvent, deltaX: number) {
    const { sidebarLeftPosition } = this.state;
    const sidebarOffset = this.sidebarWidth + sidebarLeftPosition;
    // contains should be used because the SwipingRight event sometimes gets fired
    // even if e.target isn't a child node of the Swipable
    // like Modal for example, which is put in the <body> by a portal
    if (this.contentRef && this.contentRef.contains(e.target as Node)) {
      this.setState((prevState: IState) => ({
        sidebarLeftPosition: Math.min(
          prevState.sidebarLeftPosition + deltaX - sidebarOffset, this.sidebarDisplayedPosition,
        ),
        isContentSwipingRight: true,
      }));
    }
  }

  @bind
  private handleOverlaySwipingLeft(_: React.TouchEvent, deltaX: number) {
    const { sidebarLeftPosition } = this.state;
    const sidebarOffset = 0 - sidebarLeftPosition;
    this.setState((prevState: IState) => ({
      isOverlaySwipingLeft: true,
      sidebarLeftPosition: Math.max(prevState.sidebarLeftPosition - deltaX + sidebarOffset, this.sidebarHiddenPosition),
    }));
  }

  @bind
  private handleContentSwiped(_: React.TouchEvent, __: number, ___: number, isFlick: boolean) {
    const { sidebarLeftPosition, isContentSwipingRight } = this.state;
    if (isContentSwipingRight) {
      const shouldSidebarBecomeHidden = sidebarLeftPosition < 0 && !isFlick;
      this.setState(() => ({
        isContentSwipingRight: false,
        sidebarLeftPosition: shouldSidebarBecomeHidden
          ? this.sidebarHiddenPosition
          : this.sidebarDisplayedPosition,
      }));
    }
  }

  @bind
  private handleOverlaySwiped(_: React.TouchEvent, __: number, ___: number, isFlick: boolean) {
    const { sidebarLeftPosition, isOverlaySwipingLeft } = this.state;
    if (isOverlaySwipingLeft) {
      const shouldSidebarBecomeHidden = -sidebarLeftPosition > this.sidebarWidth / 2 || isFlick;
      this.setState(() => ({
        isOverlaySwipingLeft: false,
        sidebarLeftPosition: shouldSidebarBecomeHidden
          ? this.sidebarHiddenPosition
          : this.sidebarDisplayedPosition,
      }));
    }
  }

  @bind
  private handleSidebarToggleClick() {
    this.setState((prevState: IState) => ({
      sidebarLeftPosition: prevState.sidebarLeftPosition < 0
        ? this.sidebarDisplayedPosition
        : this.sidebarHiddenPosition,
    }));
  }

  @bind
  private handleWindowTouchmove(event: TouchEvent) {
    if (this.state.sidebarLeftPosition > this.sidebarHiddenPosition) {
      // prevent scroll
      event.preventDefault();
    }
  }

  @bind
  private handleOverlayClick() {
    this.setState(() => ({
      sidebarLeftPosition: this.sidebarHiddenPosition
    }));
  }

  @bind
  private makeSidebarEntryClickHandler(route: IRoutable) {
    return () => {
      const { history, location: { pathname } } = this.props;
      if (pathname === route.getPath()) {
        this.setState(() => ({
          sidebarLeftPosition: this.sidebarHiddenPosition,
        }));
      } else {
        history.push(route.getPath());
      }
    };
  }

  @bind
  private handleSupportMenuEntryClick() {
    window.chatButton.onClick();
  }
}

const connectedMLayout = connect<IStateProps, IActionProps>(mapState, mapDispatch)(i18nConnect(MLayout));

export default withRouter(connectedMLayout);
