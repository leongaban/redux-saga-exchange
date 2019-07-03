import * as React from 'react';
import block from 'bem-cn';

import { Icon, Preloader } from 'shared/view/elements';

import './Input.scss';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  hasIcon?: boolean;
  search?: boolean;
  unit?: string;
  extent?: 'large' | 'middle' | 'small';
  refCallback?: any;
  isLoading?: boolean;
  fieldMixin?: string;
  renderRightPart?(): JSX.Element;
}

const b = block('input');

class Input extends React.PureComponent<IProps> {

  public render() {
    const {
      id, placeholder, value, type, disabled, onChange, readOnly, maxLength, error, autoFocus,
      onFocus, onBlur, onKeyDown, hasIcon, search, unit, tabIndex, refCallback, fieldMixin, extent = '',
    } = this.props;

    const modificators = {
      'error': !!error,
      'icon': !!hasIcon,
      'search': !!search,
      'with-unit': !!unit,
      'extent': extent,
      'disabled': !!disabled,
    };

    return (
      <div className={b()}>
        <input
          className={b('field', modificators).mix(fieldMixin || '')()}
          id={id}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete="off"
          type={type}
          onChange={onChange}
          maxLength={maxLength}
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          tabIndex={tabIndex}
          ref={refCallback}
          size={40}
          autoFocus={autoFocus}
        />
        {this.renderRightPart()}
      </div>
    );
  }

  private renderRightPart() {
    const { error, search, unit, renderRightPart, isLoading } = this.props;
    if (renderRightPart) {
      return renderRightPart();
    }

    if (unit) {
      return <div className={b('unit')()}>{unit}</div>;
    }

    if (search) {
      return <Icon className={b('icon')()} src={require('./images/search-inline.svg')} />;
    }

    if (error) {
      return <Icon className={b('icon')()} src={require('./images/cross-inline.svg')} />;
    }

    if (isLoading) {
      return (
        <div className={b('icon')()}>
          <Preloader isShow type="button" position="relative" size={1.143} />
        </div>
      );
    }
  }

}

export default Input;
export { IProps as IInputProps };
