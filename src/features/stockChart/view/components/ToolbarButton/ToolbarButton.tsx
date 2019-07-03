import React from 'react';
import block from 'bem-cn';

import './ToolbarButton.scss';

const b = block('toolbar-button');

interface IProps {
  title: string;
  mixClass?: string;
  onClick?(): void;
}

class ToolbarButton extends React.PureComponent<IProps> {

  public render() {
    const { children, title, mixClass = '', onClick } = this.props;
    return (
      <div
        className={b('content').mix(mixClass)()}
        title={title}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
}

export default ToolbarButton;
