import * as React from 'react';
import block from 'bem-cn';

import Icon from '../Icon/Icon';
import './Checkbox.scss';

const b = block('trade-checkbox');

interface IProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  labelPosition?: 'left' | 'right';
}

function Checkbox(props: IProps) {
  const { checked = false, disabled = false, labelPosition = 'right', label, ...rest } = props;
  return (
    <label className={b({ checked, disabled })()}>
      <input
        className={b('fake-input')()}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        {...rest}
      />
      <div className={b('control', { 'label-position': labelPosition })()}>
        {label && <div className={b('label')()}>{label}</div>}
        <div className={b('input')()}>
          {checked && <Icon className={b('check')()} src={require('./img/check-inline.svg')} />}
        </div>
      </div>
    </label>
  );
}

export { IProps as ICheckboxProps };
export default Checkbox;
