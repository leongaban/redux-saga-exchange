import * as React from 'react';
import Slider, { Marks } from 'rc-slider';
import 'rc-slider/assets/index.css';

import 'features/placeOrder/view/components/VolumeSlider/VolumeSlider.scss';
import './LockupAmountSlider.scss';

interface IProps {
  value: number;
  total: number;
  yourTioBalance: string;
  onChange(value: number): void;
}

const getMark = (index: number) => {
  if (index === 0 || index === 10) {
    return {
      label: `${index * 10}%`,
      style: {
        marginLeft: '0%',
        transform: `translateX(calc(-50% ${index === 0 ? '+ 11px' : '- 13px'}))`
      }
    };
  }
  return `${index * 10}%`;
};

class LockupAmountSlider extends React.PureComponent<IProps> {
  public render() {
    const { onChange, value, total, yourTioBalance } = this.props;

    if (total > 0) {
      const marks = this.createMarks(total);
      const tenth = total / 10;

      return (
        <Slider
          defaultValue={value}
          min={0}
          max={total}
          step={tenth}
          marks={marks}
          onChange={onChange}
          value={value}
        />
      );
    }

    return (<div className="lockup-balance-zero">{yourTioBalance} 0.</div>);
  }

  private createMarks(total: number): Marks {
    return Array.from({ length: 11 })
      .map((_, index) => index)
      .reduce((acc, value) => {
        const key = total / 10 * value;
        return {
          ...acc,
          [key]: getMark(value)
        };
      }, {});
  }
}

export default LockupAmountSlider;
