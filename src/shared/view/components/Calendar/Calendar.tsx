import * as React from 'react';
import block from 'bem-cn';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import './Calendar.scss';

export interface IProps extends ReactDatePickerProps {
  children?: React.ReactNode;
  onEscapePress?(event: any): void;
}

const b = block('calendar');

class Calendar extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { onEscapePress } = this.props;
    if (onEscapePress) {
      document.addEventListener('keydown', onEscapePress);
    }
  }

  public componentWillUnmount() {
    const { onEscapePress } = this.props;
    if (onEscapePress) {
      document.removeEventListener('keydown', onEscapePress);
    }
  }

  public render() {
    const { children, ...restProps } = this.props;

    return (
    <div className={b()}>
      <DatePicker
        {...restProps}
        useWeekdaysShort
        inline
      >
        {children}
      </DatePicker>
    </div>);
  }
}

export default Calendar;
