import * as React from 'react';
import block from 'bem-cn';

import './ArrowControls.scss';

interface IOwnProps {
  onUpControlClick(): void;
  onDownControlClick(): void;
}

const b = block('arrow-controls');

type IProps = IOwnProps;

class ArrowControls extends React.PureComponent<IProps> {
  public render() {
    const { onUpControlClick, onDownControlClick } = this.props;
    return (
      <div className={b()}>
        <div className={b('arrow-button')()} onClick={onUpControlClick}>
          <div className={b('arrow', { direction: 'up' })()}/>
        </div>
        <div className={b('arrow-button')()} onClick={onDownControlClick}>
          <div className={b('arrow', { direction: 'down' })()}/>
        </div>
      </div>
    );
  }
}

export default ArrowControls;
