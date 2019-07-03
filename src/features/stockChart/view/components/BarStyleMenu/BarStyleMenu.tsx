import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { Icon } from 'shared/view/elements';
import { IMenuEntry, Menu } from 'shared/view/components';
import { BarStyle } from 'shared/types/models';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import './BarStyleMenu.scss';

const b = block('bar-style-menu');

interface IProps {
  selected: BarStyle;
  onEntryItemClick(barStyle: BarStyle): void;
}

const barStyleSections: BarStyle[][] = [
  ['bar', 'candle', 'hollow-candle', 'heikin-ashi', 'line', 'area', 'baseline'],
];

class BarStyleMenu extends React.PureComponent<IProps> {

  private barStyleEntries: IMenuEntry[][] = barStyleSections.map(section => {
    return section.map(barStyleId => ({
      onClick: () => this.props.onEntryItemClick(barStyleId),
      content: (
        <>
          {this.renderBarStyleIcon(barStyleId)}
          <span> {barStyleId} </span>
        </>
      ),
      text: barStyleId,
    }));
  });

  public render() {
    const { selected } = this.props;
    return (
      <Menu entriesSections={this.barStyleEntries}>
        <ToolbarButton title="Select chart type...">
          <div className={b()}>
            {this.renderBarStyleIcon(selected)}
          </div>
        </ToolbarButton>
      </Menu>
    );
  }

  @bind
  private renderBarStyleIcon(id: BarStyle) {
    return (
      <Icon
        className={b('icon')()}
        src={require(`./images/${id}-inline.svg`)}
      />
    );
  }
}

export default BarStyleMenu;
