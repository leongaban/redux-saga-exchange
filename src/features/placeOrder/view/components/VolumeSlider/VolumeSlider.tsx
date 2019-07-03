import * as React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import './VolumeSlider.scss';

interface IProps {
  value: number;
  onChange(value: number): void;
}

class VolumeSlider extends React.PureComponent<IProps> {
  private marks = {
    25: {
      label: '25%',
      style: { marginLeft: '0%', transform: 'translateX(calc(-50% + 5px))' },
    },
    50: '50%',
    75: '75%',
    100: {
      label: '100%',
      style: { marginLeft: '0%', transform: 'translateX(calc(-50% - 5px))' },
    },
  };

  public render() {
    const { onChange, value } = this.props;
    return (
      <Slider
        min={0}
        max={100}
        step={25}
        dots
        marks={this.marks}
        onChange={onChange}
        value={value}
      />
    );
  }
}

export default VolumeSlider;
