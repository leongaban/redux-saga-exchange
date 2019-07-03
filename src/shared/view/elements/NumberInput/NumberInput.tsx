import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { Input, ArrowControls } from 'shared/view/elements';
import { floorFloatToFixed } from 'shared/helpers/number';

import './NumberInput.scss';

interface IProps {
  step: number;
  value: string;
  accuracy?: number;
  dropdownText?: string;
  dropdownValue?: string;
  error?: boolean;
  unit?: string;
  autoFocus?: boolean;
  placeholder?: string;
  id?: string;
  max?: number;
  onChange(value: string): void;
}

interface IState {
  isDropdownOpen: boolean;
}

const b = block('number-input');

class NumberInput extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isDropdownOpen: false,
  };

  private isMouseOverDropdown: boolean = false;

  public render() {
    const {
      value,
      error,
      unit,
      dropdownText,
      autoFocus,
      placeholder,
      id,
    } = this.props;
    return (
      <div className={b()}>
        {this.renderDecrementer()}
        <div className={b('input-field')()}>
          <Input
            value={value}
            id={id}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            error={error}
            unit={unit}
            autoFocus={autoFocus}
            placeholder={placeholder}
          />
        </div>
        {this.renderIncrementer()}
        <div className={b('value-controls')()}>
          <ArrowControls
            onDownControlClick={this.makeStepControlClickHandler('decrement')}
            onUpControlClick={this.makeStepControlClickHandler('increment')}
          />
        </div>
        {dropdownText && this.state.isDropdownOpen && this.renderDropdown()}
      </div>
    );
  }

  private renderDropdown() {
    const { dropdownText } = this.props;
    return (
      <div
        className={b('dropdown')()}
        onClick={this.handleDropdownClick}
        onMouseEnter={this.handleDropdownMouseEnter}
        onMouseLeave={this.handleDropdownMouseLeave}
      >
        {dropdownText}
      </div>
    );
  }

  @bind
  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChange(event.target.value);
  }

  @bind
  private handleInputFocus() {
    this.setState(() => ({
      isDropdownOpen: true,
    }));
  }

  @bind
  private handleInputBlur() {
    if (!this.isMouseOverDropdown) {
      this.setState(() => ({
        isDropdownOpen: false,
      }));
    }
  }

  private renderIncrementer() {
    return (
      <div
        className={b('m-incrementer')()}
        onClick={this.makeStepControlClickHandler('increment')}
      >
        <div className={b('m-plus-horizontal-line')()}>
          <div className={b('m-plus-vertical-line')()} />
        </div>
      </div>
    );
  }

  private renderDecrementer() {
    return (
      <div
        className={b('m-decrementer')()}
        onClick={this.makeStepControlClickHandler('decrement')}
      >
        <div className={b('m-minus')()} />
      </div>
    );
  }

  @bind
  private makeStepControlClickHandler(stepKind: 'decrement' | 'increment') {
    return () => {
      const { accuracy, step, value, onChange, max } = this.props;
      if (step) {
        const inputValue = Number(value);
        const formatAccuracy = accuracy !== void 0
          ? accuracy
          : this.getDefaultAccuracy(step);
        if (!Number.isNaN(inputValue)) {
          const nextValue = ((): number | string => {
            switch (stepKind) {
              case 'decrement':
                return inputValue && floorFloatToFixed(inputValue - step, formatAccuracy);
              case 'increment':
                const calculatedNextValue = floorFloatToFixed(inputValue + step, formatAccuracy);
                return max
                  ? floorFloatToFixed(Math.min(Number(calculatedNextValue), max), formatAccuracy)
                  : calculatedNextValue;
              default:
                const badStepKind: never = stepKind;
                console.warn('unexpected stepKind value', badStepKind);
                return inputValue;
            }
          })();
          onChange(String(nextValue));
        }
      }
    };
  }

  private getDefaultAccuracy(step: number) {
    const decimals = String(step).split('.')[1];
    return decimals ? decimals.length : 0;
  }

  @bind
  private handleDropdownClick() {
    const { dropdownValue } = this.props;
    if (dropdownValue) {
      this.props.onChange(dropdownValue);
      this.handleDropdownMouseLeave();
      this.setState(() => ({
        isDropdownOpen: false,
      }));
    }
  }

  @bind
  private handleDropdownMouseEnter() {
    this.isMouseOverDropdown = true;
  }

  @bind
  private handleDropdownMouseLeave() {
    this.isMouseOverDropdown = false;
  }
}

export default NumberInput;
export { IProps as INumberInputProps };
