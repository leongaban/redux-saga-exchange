import * as React from 'react';
import block from 'bem-cn';

import './WidgetTitle.scss';

const b = block('widget-title');

interface IProps {
  textTransform?: 'uppercase' | 'initial';
}

class WidgetTitle extends React.PureComponent<IProps> {
  public render() {
    const { textTransform = 'uppercase' } = this.props;
    return <h3 className={b({ 'text-transform': textTransform })()}>{this.props.children}</h3>;
  }
}

export default WidgetTitle;
