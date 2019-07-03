import * as React from 'react';
import block from 'bem-cn';

import './Link.scss';

const b = block('link');

class Link extends React.PureComponent<React.HTMLProps<HTMLAnchorElement>> {

  public render() {
    const { children, className,  ...restProps } = this.props;
    const mixClass = className ? ' ' + className : '';
    return (
      <a className={b() + mixClass} {...restProps}>
        {children}
      </a>
    );
  }

}

export default Link;
