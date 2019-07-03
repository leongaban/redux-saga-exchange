import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Icon } from 'shared/view/elements';

import './WidgetNE.scss';

interface IProps {
  title?: string;
  width?: string;
  height?: string;
  content?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const b = block('widget-ne');

class WidgetNE extends React.PureComponent<IProps> {
  public render() {
    const { title, content, header, width, height, className } = this.props;
    return (
      <div
        className={b.mix(className || '')()}
        style={{
          width: width ? width : 'inherit',
          height: height ? height : 'inherit',
        }}
      >
        {header ? header : (
          <div className={b('header')()}>
            <h3 className={b('title')()}>{title}</h3>
            <div className={b('controls')()}>
              <div className={b('settings')()} onClick={this.handleSettingClick}>
                <Icon className={b('settings-icon')()} src={require('./images/settings-inline.svg')} />
              </div>
              <div className={b('close')()} onClick={this.handleCloseClick}>
                <Icon className={b('close-icon')()} src={require('./images/close-inline.svg')} />
              </div>
            </div>
          </div>
        )}
        <div className={b('content')()}>
          {content}
        </div>
      </div>
    );
  }

  @bind
  private handleSettingClick() {
    console.log('handleSettingClick has been called');
  }

  @bind
  private handleCloseClick() {
    console.log('handleCloseClick has been called');
  }
}

export default WidgetNE;
