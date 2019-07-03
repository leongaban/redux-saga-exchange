import * as React from 'react';
import block from 'bem-cn';

import { Icon } from 'shared/view/elements';

import './ReportContainer.scss';

interface IProps {
  title: string;
  onSettingsClick?(): void;
  renderHeaderRightPart?(): JSX.Element;
}

const b = block('report-container');

class ReportContainer extends React.PureComponent<IProps> {
  public render() {
    const { title, children, renderHeaderRightPart, onSettingsClick } = this.props;
    return (
      <div className={b()}>
        <div className={b('header')()}>
          <div className={b('title')()}>{title}</div>
          <div className={b('header-right-part')()}>
            {renderHeaderRightPart && renderHeaderRightPart()}
            {onSettingsClick &&
              <div className={b('settings')()} onClick={onSettingsClick}>
                <Icon className={b('settings-icon')()} src={require('./img/settings-inline.svg')} />
              </div>
            }
          </div>
        </div>
        <div className={b('content')()}>
          {children}
        </div>
      </div>
    );
  }
}

export default ReportContainer;
