import * as React from 'react';
import block from 'bem-cn';

import './ProgressBar.scss';

export interface IProps {
  percent: number;
  text?: string;
}

const b = block('load-progress-bar');

function ProgressBar({ percent, text }: IProps) {

  const indicatorStyle = {
    width: `${percent}%`,
  };

  return (
    <div className={b()}>
      <div className={b('container')()}>
        <div style={indicatorStyle} className={b('indicator')()} />
      </div>
      {text && <div className={b('text')()}>{text}</div>}
    </div>
  );
}

export default ProgressBar;
