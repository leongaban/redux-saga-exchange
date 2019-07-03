import * as React from 'react';
import block from 'bem-cn';

import './LinedSection.scss';

interface IProps {
  withBorder?: boolean;
  title?: string;
}

const b = block('lined-section');

class LinedSection extends React.PureComponent<IProps> {
  public render() {
    const { children, withBorder, title } = this.props;
    return (
      <div className={b({ 'with-border': !!withBorder })()}>
        {title && <div className={b('title')()}>{title}</div>}
        {children}
      </div>
    );
  }
}

export default LinedSection;
