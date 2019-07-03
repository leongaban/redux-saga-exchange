import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Input, IInputProps, Button } from 'shared/view/elements';
import { Calendar } from 'shared/view/components';
import moment from 'services/moment';
import './DateInput.scss';

export interface IProps extends IInputProps {
  error?: boolean;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  doesStoreEndOfDay?: boolean;
  position?: 'center' | 'bottom';
  onChangeValue(value: number): void;
}

interface IState {
  isOpen: boolean;
}

const b = block('date-input');

class DateInput extends React.PureComponent<IProps, IState> {

  public state: IState = {
    isOpen: false,
  };

  private dateDiv: HTMLDivElement;

  public componentWillMount() {
    document.getElementById('root')!.addEventListener('click', this.handleDocumentClick);
  }

  public componentWillUnmount() {
    document.getElementById('root')!.removeEventListener('click', this.handleDocumentClick);
  }

  public render() {
    const { error, value, tabIndex, onBlur, position = 'center', ...restProps } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={b()} ref={this.initDateDiv}>
        <Input
          {...restProps}
          onFocus={this.handleInputFocus}
          value={value}
          error={error}
          tabIndex={tabIndex}
          readOnly
        />
        {isOpen &&
          <div className={b('calendar', { position })()}>
            {this.renderCalendar()}
          </div>
        }
      </div>
    );
  }

  private renderCalendar() {
    const { minDate, maxDate, value } = this.props;

    return (
      <Calendar
        selected={value ? moment(value) : void 1}
        onChange={this.handleChange}
        minDate={minDate}
        maxDate={maxDate}
        onEscapePress={this.handleEscapeButtonPress}
      >
        {this.renderControls()}
      </Calendar>);
  }

  private renderControls() {
    return (
      <div className={b('buttons')()}>
        <div className={b('button')()}>
          <Button size="large" color="black-white" onClick={this.handleCalendarClose}>
            close
          </Button>
        </div>
        <div className={b('button')()}>
          <Button size="large" name="confirm" onClick={this.handleConfirmClick}>
            confirm
          </Button>
        </div>
      </div>);
  }

  @bind
  private initDateDiv(x: HTMLDivElement) {
    this.dateDiv = x;
  }

  @bind
  private handleDocumentClick(event: MouseEvent) {
    if (this.dateDiv) {
      if (!this.dateDiv.contains(event.target as Node)) {
        this.handleCalendarClose();
      }
    } else {
      console.error('selected option not initialized');
    }
  }

  @bind
  private handleChange(x: moment.Moment) {
    this.props.onChangeValue(+x);
  }

  @bind
  private handleCalendarOpen() {
    this.setState({ isOpen: true });
  }

  @bind
  private handleCalendarClose() {
    this.setState({ isOpen: false });
  }

  @bind
  private handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
    const { onFocus } = this.props;
    this.handleCalendarOpen();
    if (onFocus) {
      onFocus(e);
    }
  }

  @bind
  private handleConfirmClick() {
    const { onChangeValue, doesStoreEndOfDay, value } = this.props;
    const newValue = doesStoreEndOfDay
      ? +moment(value, 'L').add(23, 'hours').add(59, 'minutes')
      : +moment(value, 'L');
    onChangeValue(newValue as number);
    this.handleCalendarClose();
  }

  @bind
  private handleEscapeButtonPress(event: any) {
    if ((event as KeyboardEvent).keyCode === 27) {
      this.handleCalendarClose();
    }
  }
}

export { IProps as IDateInputProps };
export default DateInput;
