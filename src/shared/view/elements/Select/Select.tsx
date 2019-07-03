import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import './Select.scss';

interface IProps<T> {
  options: T[];
  disabled?: boolean;
  selectedOption: T;
  placeholder?: string;
  optionHeader?: string;
  onSelect(option: T): void;
  optionValueKey(option: T): string;
}

interface IState {
  open: boolean;
}

const b = block('select');

class Select<T> extends React.PureComponent<IProps<T>, IState> {

  public state: IState = {
    open: false,
  };

  private selectedOption: HTMLDivElement | null = null;

  public componentWillMount() {
    document.body.addEventListener('click', this.handleDocumentBodyClick);
  }

  public componentWillUnmount() {
    document.body.removeEventListener('click', this.handleDocumentBodyClick);
  }

  public render() {
    const { open } = this.state;
    const { options, selectedOption, disabled, optionHeader } = this.props;

    return (
      <div className={b({ open })()}>
        <div
          className={b('option', { selected: true, disabled: !!disabled })()}
          onClick={!disabled ? this.handleSelectedOptionClick : void (0)}
          ref={this.initSelectedOption}
        >
          {this.renderOptionContent(selectedOption)}
          <div className={b('arrow')()} />
        </div>
        <div className={b('list', { open })()}>
          {optionHeader && <div className={b('header-option')()}>{optionHeader}</div>}
          {options.map(this.renderOption)}
        </div>
      </div>
    );
  }

  private renderOptionContent(x: T) {
    const { optionValueKey, placeholder } = this.props;
    const value = optionValueKey(x);
    return (
      <div className={b('value')()}>
        {value ?
          <span>
            {value}
          </span> :
          <span className={b('placeholder')()}>
            {placeholder}
          </span>}
      </div>
    );
  }

  @bind
  private initSelectedOption(x: HTMLDivElement | null) {
    this.selectedOption = x;
  }

  @bind
  private handleDocumentBodyClick(event: MouseEvent) {
    if (this.selectedOption) {
      if (!this.selectedOption.contains(event.target as Node)) {
        this.setState(() => ({ open: false }));
      }
    } else {
      console.error('selected option not initialized');
    }
  }

  @bind
  private renderOption(x: T, index: number) {
    const { selectedOption } = this.props;
    const isSelected = x === selectedOption;
    return (
      <div
        className={b('option', { 'from-list': true, 'from-list-selected': isSelected })()}
        onClick={this.makeOptionClickHandler(x)}
        key={index}
      >
        {this.renderOptionContent(x)}
      </div>
    );
  }

  private makeOptionClickHandler(option: T) {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      this.setState(() => ({
        open: false,
      }));
      this.props.onSelect(option);
    };
  }

  @bind
  private handleSelectedOptionClick() {
    this.setState(({ open }: IState) => ({ open: !open }));
  }

}

export { IProps as ISelectProps };
export default Select;
