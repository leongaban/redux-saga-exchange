import React from 'react';
import block from 'bem-cn';

import './Toggle.scss';

const b = block('toggle');

interface IProps extends React.HTMLProps<HTMLInputElement> {
  leftLabel: string;
  rightLabel: string;
  title?: string;
}

function Toggle(props: IProps) {
  const { leftLabel, rightLabel, title, ...restProps } = props;
  return (
    <label className={b({ checked: Boolean(restProps.checked) })()}>
      {title && <div className={b('title')()}>{title}</div>}
      <input className={b('fake-input')()} type="checkbox" {...restProps}/>
      <div className={b('label', { active: !Boolean(restProps.checked) })()}>
          {leftLabel}
        </div>
        <div className={b('switch')()}>
          <div className={b('switch-thumb')()} />
        </div>
        <div className={b('label', { active: !!Boolean(restProps.checked) })()}>
          {rightLabel}
        </div>
    </label>
  );
}

export { IProps as IToggleProps };
export default Toggle;
