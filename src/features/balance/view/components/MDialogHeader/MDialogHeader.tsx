import * as React from 'react';
import block from 'bem-cn';

import './MDialogHeader.scss';

interface IProps {
  title: string;
  subtitle: React.ReactNode;
}

const b = block('m-dialog-header');

class MDialogHeader extends React.PureComponent<IProps> {
  public render() {
    const { title, subtitle } = this.props;
    return (
      <header className={b()}>
        <h2 className={b('title')()}>
          {title}
        </h2>
        <div className={b('subtitle')()}>
          {subtitle}
        </div>
      </header>
    );
  }
}

export default MDialogHeader;
