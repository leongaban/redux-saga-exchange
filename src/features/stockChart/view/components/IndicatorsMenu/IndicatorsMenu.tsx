import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { IMenuEntry, Menu } from 'shared/view/components';
import { Icon } from 'shared/view/elements';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import './IndicatorsMenu.scss';

const b = block('indicators-menu');

interface IProps {
  kind: 'trading-view' | 'stockChart-x';
  onMenuEntryClick?(indicator: string): void;
  onButtonClick?(): void;
}

class IndicatorsMenu extends React.PureComponent<IProps> {

  private menuIndicatorEntriesSections: IMenuEntry[][] = [
    [{ content: 'MACD', onClick: () => this.handleMenuEntryClick('CustomMACD') }],
    [{ content: 'Volume indicator', onClick: () => this.handleMenuEntryClick('ColoredVolume') }],
    [{ content: 'Simple Moving Average ', onClick: () => this.handleMenuEntryClick('SMA') }],
  ];

  public render() {
    const { kind } = this.props;
    return (
      <div className={b()}>
        {
          kind === 'stockChart-x'
            ? (
              <Menu entriesSections={this.menuIndicatorEntriesSections} menuPosition="right">
                {this.renderToolbarButton()}
              </Menu>
            ) : this.renderToolbarButton()
        }
      </div>
    );
  }

  @bind
  private renderToolbarButton() {
    const { onButtonClick } = this.props;
    return (
      <ToolbarButton title="Add Indicators..." onClick={onButtonClick}>
        <div className={b('content')()}>
          <Icon className={b('icon')()} src={require('./images/indicators-inline.svg')} />
        </div>
      </ToolbarButton>
    );
  }

  @bind
  private handleMenuEntryClick(indicator: string) {
    const { onMenuEntryClick } = this.props;
    if (onMenuEntryClick) {
      onMenuEntryClick(indicator);
    }
  }
}

export default IndicatorsMenu;
