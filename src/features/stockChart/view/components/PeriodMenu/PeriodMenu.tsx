import React from 'react';
import block from 'bem-cn';

import { IMenuEntry, Menu } from 'shared/view/components';
import { PeriodicityUnit } from 'shared/types/models';

import { intervalEntries } from '../../../constants';
import ToolbarButton from '../ToolbarButton/ToolbarButton';
import './PeriodMenu.scss';

const b = block('period-menu');

interface IProps {
  interval: number;
  periodicity: PeriodicityUnit;
  onEntryItemClick(interval: number, periodicity: PeriodicityUnit): void;
}

class PeriodMenu extends React.PureComponent<IProps> {

  private menuIntervalEntriesSection: IMenuEntry[][] = intervalEntries.map(item => {
    return [{
      content: item.textualRepresentation,
      onClick: () => this.props.onEntryItemClick(item.period, item.periodicityUnit),
    }];
  });

  public render() {
    const { interval, periodicity } = this.props;
    return (
      <div className={b()}>
        <Menu entriesSections={this.menuIntervalEntriesSection} menuPosition="right">
          <ToolbarButton title="Select period...">
            <div className={b('content')()}>
              <span>{`${interval}${periodicity}`}</span>
            </div>
          </ToolbarButton>
        </Menu>
      </div>
    );
  }
}

export default PeriodMenu;
