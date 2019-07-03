import { withRouter, RouteComponentProps } from 'react-router';
import block from 'bem-cn';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as configActions, selectors as configSelectors } from 'services/config/redux';
import { UITheme } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { Role } from 'shared/types/models';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { selectors as userServiceSelectors } from 'services/user';

import Sidebar from '../../components/Sidebar/Sidebar';
import AdminHeader from '../../components/AdminHeader/AdminHeader';

import './AdminLayout.scss';

const b = block('admin-page');

interface IStateProps {
  uiTheme: UITheme;
  userRoles: Role[] | null;
}

interface IActionProps {
  saveTheme: typeof configActions.saveTheme;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    uiTheme: configSelectors.selectUITheme(state),
    userRoles: userServiceSelectors.selectUserRoles(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    saveTheme: configActions.saveTheme,
  }, dispatch);
}

type Props = RouteComponentProps<void> & IActionProps & IStateProps & ITranslateProps;

class AdminLayout extends React.PureComponent<Props> {
  private isUserSupport = (() => {
    const { userRoles } = this.props;
    return userRoles ? userRoles.includes('Support') : false;
  })();

  public render() {
    const { children, location, uiTheme, translate, saveTheme } = this.props;
    return (
      <div className={b({ 'no-sidebar': this.isUserSupport })()}>
        {this.renderSidebar()}
        <div className={b('content-section')()}>
          <AdminHeader
            location={location}
            uiTheme={uiTheme}
            saveUiTheme={saveTheme}
            translate={translate}
          />
          {children}
        </div>
      </div>
    );
  }

  private renderSidebar() {
    return this.isUserSupport ? null : <Sidebar />;
  }
}

const connectedLayout = connect<IStateProps, IActionProps, {}>(mapState, mapDispatch)(i18nConnect(AdminLayout));

export default withRouter(connectedLayout);
