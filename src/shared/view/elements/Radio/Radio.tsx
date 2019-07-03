import * as React from 'react';
import block from 'bem-cn';

import { RadioColorsSet } from 'shared/types/ui';

import './Radio.scss';

const b = block('radio-button');

interface IProps extends React.HTMLProps<HTMLInputElement> {
  position?: 'left' | 'right' | 'center' | 'single';
  extent?: 'large' | 'middle' | 'small';
  fontSize?: 'big' | 'small';
  icon?: JSX.Element;
  withTextAndIcon?: boolean;
  tooltip?: JSX.Element;
  radioValue?: string;
  colorsSet?: RadioColorsSet;
  labelClassNameMix?: string;
}

function Radio(props: IProps) {
  const {
    checked = false,
    disabled = false,
    position = 'center',
    colorsSet = 'primary',
    extent = 'large',
    fontSize = 'big',
    label,
    icon,
    tooltip,
    withTextAndIcon,
    labelClassNameMix,
    ...restProps
  } = props;
  const inputModificators = { position, extent, 'colors-set': colorsSet, 'with-text-and-icon': !!withTextAndIcon };
  return (
    <label className={b({ checked, disabled })()}>
      <input className={b('fake-input')()} type="radio" checked={checked} disabled={disabled} {...restProps} />
      <div className={b('input', inputModificators)()}>
        {label && (!icon || withTextAndIcon) &&
          <div
            className={b('label', { 'font-size': fontSize }).mix(labelClassNameMix ? labelClassNameMix : [])()}
          >
            {label}
            {tooltip && <div className={b('tooltip')()}>{tooltip}</div>}
          </div>
        }
        {icon && <div className={b('icon')()}>{icon}</div>}
      </div>
    </label>
  );
}

export { IProps as IRadioProps };
export default Radio;
