import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Input, Error, Icon } from 'shared/view/elements';

import './Autocomplete.scss';

interface IProps<T> {
  options: T[];
  defaultOption: T;
  selectedOption?: T;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  allowCustomOptions?: boolean;
  disabled?: boolean;
  addOptionText?: string;
  isShowSelectedOptionDisabled?: boolean;
  onSelect(option: T): void;
  optionValueKey(option: T): string;
  onAddOptionClick?(): void;
  onOptionDelete?(option: T): void;
  renderOptionValue?(option: T): JSX.Element | string;
  renderInputValue?(option: T): string; // TODO remove after renaming tio-tiox will succeeded!!
}

interface IState {
  open: boolean;
  filterValue: string;
}

const b = block('autocomplete');

class Autocomplete<T> extends React.PureComponent<IProps<T>, IState> {

  public state: IState = {
    open: false,
    filterValue: this.props.selectedOption ? this.props.optionValueKey(this.props.selectedOption) : '',
  };

  private selectedOption: HTMLDivElement | null = null;
  private optionsList: HTMLDivElement | null = null;
  private wasDeleteOptionClicked: boolean = false;

  public componentWillMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  public render() {
    const { open } = this.state;
    const {
      options,
      selectedOption,
      optionValueKey,
      placeholder,
      defaultOption,
      error,
      autoFocus,
      addOptionText,
      disabled,
      renderInputValue,
    } = this.props;
    const filteredOptions = options.filter((option) => this.isFilterValueInOption(optionValueKey(option)));
    const value = selectedOption
      ? (renderInputValue ? renderInputValue(selectedOption) : optionValueKey(selectedOption))
      : optionValueKey(defaultOption);
    return (
      <div
        className={b({ open })()}
      >
        <div ref={this.initSelectedOption} className={b('selected-option')()}>
          <Input
            value={value}
            onChange={this.onSelectedOptionChange}
            onFocus={this.handleSelectedOptionFocus}
            placeholder={placeholder}
            error={!!error}
            autoFocus={autoFocus}
            disabled={disabled}
          />
        </div>
        <div
          className={b('list', { open })()}
          ref={this.initOptionsList}
        >
          {filteredOptions.map(this.renderOption)}
          {addOptionText && this.renderAddOption()}
        </div>
        {!!error && <Error>{error}</Error>}
      </div>
    );
  }

  private renderAddOption() {
    const { addOptionText } = this.props;
    return (
      <div className={b('option', { 'from-list': true })()} onClick={this.handleAddOptionClick}>
        <div className={b('value', { 'add-option': true })()}>
          <Icon className={b('add-option-icon')()} src={require('./img/plus-inline.svg')} />
          {addOptionText}
        </div>
      </div>
    );
  }

  @bind
  private handleAddOptionClick(event: React.MouseEvent) {
    const { onAddOptionClick } = this.props;
    event.stopPropagation();
    if (onAddOptionClick) {
      onAddOptionClick();
    }
  }

  @bind
  private handleDocumentClick(event: MouseEvent) {
    const { defaultOption, optionValueKey, onSelect, allowCustomOptions } = this.props;

    if (this.wasDeleteOptionClicked) {
      this.wasDeleteOptionClicked = false;
      return;
    }

    if (this.selectedOption) {
      if (!this.selectedOption.contains(event.target as Node)) {
        this.setState({ open: false });
      }

      if (this.optionsList) {
        if (!this.optionsList.contains(event.target as Node)) {
          if (!this.isSelectedValueExistInOptions() && !allowCustomOptions) {
            onSelect(defaultOption);
            this.setState({ filterValue: optionValueKey(defaultOption) });
          }
        }
      } else {
        console.error('list options not initialized');
      }
    } else {
      console.error('selected option not initialized');
    }
  }

  @bind
  private renderOption(x: T, index: number) {
    const { selectedOption, optionValueKey, isShowSelectedOptionDisabled } = this.props;
    const isSelected = selectedOption ? optionValueKey(x) === optionValueKey(selectedOption) : false;
    return (
      <div
        className={b('option', {
          'from-list': true,
          'from-list-selected': !isShowSelectedOptionDisabled && isSelected,
        })()}
        onClick={this.makeOptionClickHandler(x)}
        key={index}
      >
        {this.renderOptionContent(x)}
      </div>
    );
  }

  private renderOptionContent(x: T) {
    const { optionValueKey, renderOptionValue, onOptionDelete } = this.props;
    return (
      <div className={b('value')()}>
        {renderOptionValue
          ? renderOptionValue(x)
          : optionValueKey(x)}
        {onOptionDelete && (
          <div className={b('delete-option-button')()} onClick={this.makeDeleteOptionClickHandler(x)}>
            <Icon className={b('delete-option-icon')()} src={require('./img/cross-inline.svg')} />
          </div>
        )}
      </div>
    );
  }

  private makeOptionClickHandler(option: T) {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      this.props.onSelect(option);
      this.setState(() => ({
        open: false,
        filterValue: this.props.optionValueKey(option),
      }));
    };
  }

  private makeDeleteOptionClickHandler(option: T) {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      this.wasDeleteOptionClicked = true;
      event.stopPropagation();
      const { onOptionDelete } = this.props;
      if (onOptionDelete) {
        onOptionDelete(option);
      }
    };
  }

  @bind
  private isFilterValueInOption(option: string) {
    return option.toLowerCase().includes(this.state.filterValue.toLowerCase());
  }

  @bind
  private handleSelectedOptionFocus() {
    this.setState((prevState: IState) => {
      return {
        open: true,
        filterValue: prevState.open ? prevState.filterValue : '',
      };
    });
  }

  @bind
  private onSelectedOptionChange(event: any) {
    this.props.onSelect(event.target.value);
    this.setState({ filterValue: event.target.value });
  }

  @bind
  private initSelectedOption(x: HTMLDivElement | null) {
    this.selectedOption = x;
  }

  @bind
  private initOptionsList(x: HTMLDivElement | null) {
    this.optionsList = x;
  }

  private isSelectedValueExistInOptions() {
    const { selectedOption, optionValueKey } = this.props;
    return this.props.options.reduce((isExist, curOption) => {
      return isExist = isExist
        || (selectedOption ? optionValueKey(curOption) === optionValueKey(selectedOption) : false);
    }, false);
  }

}

export { IProps as IAutocompleteProps };
export default Autocomplete;
