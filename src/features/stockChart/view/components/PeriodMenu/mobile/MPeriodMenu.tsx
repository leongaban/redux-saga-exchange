import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { PeriodicityUnit } from 'shared/types/models';
import { Radio, MenuRadio } from 'shared/view/elements/';
import { IMenuEntry } from 'shared/view/components';
import './MPeriodMenu.scss';

interface IOwnProps {
  interval: number;
  periodicity: PeriodicityUnit;
  onEntrySelect(interval: number, periodicity: PeriodicityUnit): void;
}

type IProps = IOwnProps;

const b = block('m-period-menu');

class MPeriodMenu extends React.PureComponent<IProps> {
  private minuteIntervalMenuEntries: IMenuEntry[][] = [
    [{
      content: '1Min',
      onClick: this.makeEntrySelectHandler(1, 'm'),
    }],
    [{
      content: '5Min',
      onClick: this.makeEntrySelectHandler(5, 'm'),
    }],
    [{
      content: '15Min',
      onClick: this.makeEntrySelectHandler(15, 'm'),
    }],
    [{
      content: '30Min',
      onClick: this.makeEntrySelectHandler(30, 'm'),
    }],
    [{
      content: '60Min',
      onClick: this.makeEntrySelectHandler(1, 'h'),
    }],
  ];

  public render() {
    const { interval, periodicity } = this.props;
    const menuRadioLabel = (() => {
      switch (periodicity) {
        case 'h':
          return '60 Min';
        case 'm':
          return `${interval} Min`;
        default:
          return 'Min';
      }
    })();
    return (
      <div className={b()}>
        <Radio
          name="chart-interval"
          label="1 Month"
          position="left"
          extent="large"
          readOnly
          checked={interval === 1 && periodicity === 'M'}
          onClick={this.makeEntrySelectHandler(1, 'M')}
        />
        <Radio
          name="chart-interval"
          label="1 Week"
          position="center"
          extent="large"
          readOnly
          checked={interval === 1 && periodicity === 'w'}
          onClick={this.makeEntrySelectHandler(1, 'w')}
        />
        <Radio
          name="chart-interval"
          label="1 Day"
          position="center"
          extent="large"
          readOnly
          checked={interval === 1 && periodicity === 'd'}
          onClick={this.makeEntrySelectHandler(1, 'd')}
        />
        <MenuRadio
          name="chart-interval"
          label={menuRadioLabel}
          position="right"
          extent="large"
          readOnly
          mobile
          checked={periodicity === 'm' || periodicity === 'h'}
          menuEntries={this.minuteIntervalMenuEntries}
          menuPosition="left"
        />
      </div>
    );
  }

  @bind
  private makeEntrySelectHandler(interval: number, periodicity: PeriodicityUnit) {
    return () => this.props.onEntrySelect(interval, periodicity);
  }
}

export default MPeriodMenu;
