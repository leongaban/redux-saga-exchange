import * as React from 'react';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';

import { IAppReduxState, IQueryParams, IRoutable } from 'shared/types/app';
import { selectors as configSelectors } from 'services/config';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { Segments } from 'shared/view/elements';
import { ITab, ClientDeviceType, ISwitchableMobileContentProps } from 'shared/types/ui';

import MLayout from '../Layout/mobile/MLayout';
import Layout from '../Layout/Layout';

interface ILayoutContent<T extends string> {
  desktop: IDesktopLayoutContent | null;
  mobile: MobileLayoutContent<T> | null;
}

interface IDesktopLayoutContent {
  additionalRightPanelItem?: React.ReactNode;
  Content: React.ComponentType;
  hideLayout?: boolean;
}

type MobileLayoutContent<T extends string> =
  | ISwitchableMobileLayoutContent<T>
  | ISwitchableMobileLayoutContentWithIndividualRoutes
  | ISingleMobileContent;

interface ISwitchableMobileLayoutContentTab<T extends string> {
  key: T;
  title: string;
  Content: React.ComponentType<ISwitchableMobileContentProps<T>>;
}

interface ISwitchableMobileLayoutContentTab<T extends string> {
  key: T;
  title: string;
  Content: React.ComponentType<ISwitchableMobileContentProps<T>>;
}

interface ISwitchableMobileLayoutContentTabWithIndividualRoute {
  title: string;
  route: IRoutable;
  Content: React.ComponentType;
}

interface ISwitchableMobileLayoutContent<T extends string> {
  kind: 'switchable';
  tabs: Array<ISwitchableMobileLayoutContentTab<T>>;
}

interface ISwitchableMobileLayoutContentWithIndividualRoutes {
  kind: 'switchable-with-individual-routes';
  tabs: ISwitchableMobileLayoutContentTabWithIndividualRoute[];
}

interface ISingleMobileContent {
  kind: 'single';
  Content: React.ComponentType;
}

interface IStateProps {
  clientDeviceType: ClientDeviceType;
}

type IProps = IStateProps & ITranslateProps & RouteComponentProps<{}>;

type IWithLayoutMobileComponentProps = IProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    clientDeviceType: configSelectors.selectClientDeviceType(state),
  };
}

interface IState<T extends string> {
  activeTab: ISwitchableMobileLayoutContentTab<T> | null;
}

function withLayout<T extends string>(layoutContent: ILayoutContent<T>) {

  class WithLayout extends React.Component<IProps, IState<T>> {
    public state: IState<T> = {
      activeTab: layoutContent.mobile &&
        layoutContent.mobile.kind === 'switchable'
        ? layoutContent.mobile.tabs[0]
        : null,
    };

    private queryParams: IQueryParams = {};

    public componentDidMount() {
      const { location, history } = this.props;

      if (location.search) {
        const queryParams = parse(location.search);
        const { tab, ...restParams } = queryParams;

        this.queryParams = restParams;

        if (tab && layoutContent.mobile) {
          switch (layoutContent.mobile.kind) {
            case 'switchable': {
              const requestedActiveTab = layoutContent.mobile.tabs.find(x => x.key === tab);
              if (requestedActiveTab) {
                this.setState(
                  () => ({ activeTab: requestedActiveTab }),
                  () => history.push(location.pathname)
                );
              }
              else {
                console.warn(
                  'received invalid tab request with key',
                  tab,
                  'while valid keys are',
                  layoutContent.mobile.tabs
                );
              }
              break;
            }
            default:
              console.warn('received tab request with key', tab, 'in non switchable content', layoutContent);
          }

        }
      }
    }

    public render() {
      const { clientDeviceType } = this.props;
      if (clientDeviceType === 'mobile') {
        return this.renderMobileLayout();
      }
      if (clientDeviceType === 'desktop') {
        return this.renderDesktopLayout();
      }
    }

    private renderDesktopLayout() {
      if (layoutContent.desktop) {
        const { hideLayout, Content, additionalRightPanelItem } = layoutContent.desktop;
        return hideLayout
          ? <Content {...this.props} />
          : (
            <Layout additionalRightPanelItem={additionalRightPanelItem}>
              <Content {...this.props} />
            </Layout>
          );
      } else {
        return null;
      }
    }

    private renderMobileLayout() {
      if (layoutContent.mobile) {
        switch (layoutContent.mobile.kind) {
          case 'switchable': {
            const { activeTab } = this.state;

            if (activeTab === null) {
              console.error('unexpected null active tab');
              return <MLayout />;
            } else {
              const tabs: ITab[] = layoutContent.mobile.tabs.map((tab: ISwitchableMobileLayoutContentTab<T>) => {
                return {
                  title: tab.title,
                  key: tab.key,
                  active: activeTab === tab,
                  onClick: this.makeTabClickHandler(tab),
                };
              });

              return (
                <MLayout navigationTabs={<Segments size="large" segments={tabs} />}>
                  <activeTab.Content
                    queryParams={this.queryParams}
                    onTabSwitch={this.handleTabSwitch}
                    {...this.props}
                  />
                </MLayout>
              );
            }
          }

          case 'switchable-with-individual-routes': {

            const locationPath = this.props.location.pathname;

            const tabs: ITab[] = layoutContent.mobile.tabs.map(
              (tab: ISwitchableMobileLayoutContentTabWithIndividualRoute) => {
                return {
                  title: tab.title,
                  key: tab.route.getElementKey(),
                  active: locationPath === tab.route.getPath(),
                  onClick: this.makeRoutedTabClickHandler(tab),
                };
              });

            const activeTab = layoutContent.mobile.tabs.find(x => x.route.getPath() === locationPath);

            if (activeTab) {
              return (
                <MLayout navigationTabs={<Segments size="large" segments={tabs} />}>
                  {<activeTab.Content {...this.props} />}
                </MLayout>
              );
            } else {
              console.error('could not find active tab by path', locationPath, 'in tabs', layoutContent.mobile.tabs);
              return <MLayout navigationTabs={<Segments size="large" segments={tabs} />} />;
            }
          }

          case 'single': {
            return (
              <MLayout>
                <layoutContent.mobile.Content {...this.props} />
              </MLayout>
            );
          }

          default: {
            const badContent: never = layoutContent.mobile;
            console.error('unexpected layoutContent.mobile', badContent);
            return <MLayout />;
          }
        }
      } else {
        return null;
      }
    }

    @bind
    private handleTabSwitch(tabKey: T) {
      if (layoutContent.mobile) {
        if (layoutContent.mobile.kind === 'switchable') {
          const newActiveTab = layoutContent.mobile.tabs.find(x => x.key === tabKey);
          if (newActiveTab) {
            this.setState(() => ({ activeTab: newActiveTab }));
          } else {
            console.warn('could not find new active tab with key', tabKey);
          }
        } else {
          console.warn('unexpected mobile layout content kind', layoutContent.mobile.kind);
        }
      }
    }

    @bind
    private makeTabClickHandler(tab: ISwitchableMobileLayoutContentTab<T>) {
      return () => this.setState(() => ({ activeTab: tab }));
    }

    private makeRoutedTabClickHandler(tab: ISwitchableMobileLayoutContentTabWithIndividualRoute) {
      return () => this.props.history.push(tab.route.getPath());
    }
  }

  return (
    connect(mapState)(
      i18nConnect(
        WithLayout,
      )));
}

export {
  withLayout, IProps as IWithLayoutComponentProps, IWithLayoutMobileComponentProps, ISwitchableMobileContentProps
};
