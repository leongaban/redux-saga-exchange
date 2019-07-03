import React from 'react';
import { WrappedFieldProps } from 'redux-form';
import queryString from 'query-string';
import Autosuggest, {
  InputProps,
  ChangeEvent,
  SuggestionSelectedEventData,
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import { bind, debounce } from 'decko';
import block from 'bem-cn';

import { ICountry } from 'shared/types/models';
import { Input, Error } from 'shared/view/elements';

import './CountryField.scss';

const b = block('country');

interface IOwnProps {
  countries: ICountry[];
  loadCountries(search: string): void;
}

type IProps = IOwnProps & WrappedFieldProps;

class CountryField extends React.PureComponent<IProps> {

  public state = (() => {
    const { input: { value } } = this.props;
    return {
      value: (value && value.name) || '',
    };
  })();

  public componentWillReceiveProps({ input: { value } }: IProps) {
    const { input: { value: prevValue } } = this.props;
    if (!prevValue && value && value.id) { // when setting first value from redux form
      this.setState(() => ({ value: value.name }));
    }
  }

  public render() {
    const { meta: { touched, submitFailed, error }, countries, input: { name } } = this.props;
    const hasError = touched && submitFailed && Boolean(error);

    const inputProps = {
      name,
      value: this.state.value,
      onChange: this.handleInputChange,
      onBlur: this.handleInputBlur,
      error,
      submitFailed,
    };

    return (
      <div className={b()}>
        <Autosuggest
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          suggestions={countries}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderInputComponent={this.renderInput}
          inputProps={inputProps}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          theme={{
            suggestionsList: b('suggestions-list')(),
            suggestionHighlighted: b('suggestions-highlighted')(),
          }}
          onSuggestionSelected={this.handleSuggestionSelected}
        />
        {hasError && <Error>{error}</Error>}
      </div>
    );
  }

  private handleSuggestionsClearRequested() {
    return [];
  }

  private shouldRenderSuggestions() {
    // https://github.com/moroshko/react-autosuggest/issues/450
    return true;
  }
  @bind
  private renderInput(inputProps: InputProps<ICountry>) {
    // https://github.com/moroshko/react-autosuggest/issues/318#issuecomment-310183954
    // tslint:disable:jsx-no-string-ref
    const hasError = inputProps.submitFailed && Boolean(inputProps.error);
    return (
      <div>
        <Input
          {...inputProps}
          error={hasError}
          refCallback={inputProps.ref}
          ref={'null'}
        />
      </div>
    );
  }

  @bind
  @debounce(700)
  private handleSuggestionsFetchRequested({ value, reason }: SuggestionsFetchRequestedParams) {
    const queryParams = queryString.stringify({
      search: reason === 'input-focused' ? '' : value,
    });
    this.props.loadCountries(queryParams);
  }

  @bind
  private getSuggestionValue(suggestion: ICountry) {
    return suggestion.name;
  }

  @bind
  private renderSuggestion(suggestion: ICountry) {
    return <div className={b('option')()} >{suggestion.name}</div>;
  }

  @bind
  private handleInputChange(event: React.FormEvent<HTMLInputElement>, { newValue }: ChangeEvent) {
    this.setState({ value: newValue });
    this.props.input.onChange(event);
  }

  @bind
  private handleSuggestionSelected(
    event: React.FormEvent<HTMLSelectElement>,
    { suggestion }: SuggestionSelectedEventData<ICountry>,
  ) {
    this.props.input.onChange(suggestion);
  }

  @bind
  private handleInputBlur() {
    if (!this.state.value) {
      this.props.input.onChange('');
    }
  }
}

export default CountryField;
