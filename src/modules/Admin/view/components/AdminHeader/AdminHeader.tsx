import block from 'bem-cn';
import React from 'react';
import { Location } from 'history';

import { UITheme } from 'shared/types/ui';
import { TranslateFunction } from 'services/i18n/namespace';

import UserBar from '../../../../shared/UserBar/UserBar';
import { routesData } from '../../../constants';
// import ThemeMenu from '../../../../shared/ThemeMenu/ThemeMenu';

import './AdminHeader.scss';

const b = block('admin-header');

interface IProps {
  location: Location;
  uiTheme: UITheme;
  translate: TranslateFunction;
  saveUiTheme(theme: UITheme): void;
}

export default class AdminHeader extends React.PureComponent<IProps> {
  public render() {
    // const { uiTheme, saveUiTheme, translate } = this.props;

    return (
      <div className={b()}>
        {this.renderTitle()}
        <div className={b('control-panel')()}>
          {/* <div className={b('menu')()}>
            <ThemeMenu uiTheme={uiTheme} translate={translate} saveUiTheme={saveUiTheme} />
          </div> */}
          <UserBar isAdminPanel />
        </div>
      </div>
    );
  }

  private renderTitle() {
    const { location: { pathname } } = this.props;
    const match = /admin\/([a-z-A-Z0-9]+)/.exec(pathname);
    if (match) {
      return <span className={b('route-name')()}>{routesData[match[1]].title}</span>;
    } else {
      console.warn('>>> unexpected admin route', pathname);
    }
  }
}
