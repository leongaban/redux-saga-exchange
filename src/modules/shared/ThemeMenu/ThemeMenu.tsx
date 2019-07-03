import React from 'react';
import { bind } from 'decko';
import block from 'bem-cn';

import { IMenuEntry, Menu } from 'shared/view/components';
import { Icon } from 'shared/view/elements';
import { UITheme } from 'shared/types/ui';
import { TranslateFunction } from 'services/i18n/namespace';

import './ThemeMenu.scss';

interface IProps {
  uiTheme: UITheme;
  translate: TranslateFunction;
  size: 'big' | 'small';
  saveUiTheme(theme: UITheme): void;
}

const b = block('theme-menu');

export default class ThemeMenu extends React.Component<IProps> {
  public render() {
    const { translate: t, size } = this.props;
    const themeSelectionMenuEntries: IMenuEntry[][] = [
      [{
        content: <span className={b('theme', { size })()}>{t('LAYOUT:THEME:DAY')}</span>,
        onClick: () => this.switchTheme('day'),
      }],
      [{
        content: <span className={b('theme', { size })()}>{t('LAYOUT:THEME:NIGHT')}</span>,
        onClick: () => this.switchTheme('night'),
      }],
      [{
        content: <span className={b('theme', { size })()}>{t('LAYOUT:THEME:MOON')}</span>,
        onClick: () => this.switchTheme('moon'),
      }],
    ];
    return (
      <Menu
        menuPosition="left"
        key="menu"
        entriesSections={themeSelectionMenuEntries}
        entryHeight={size === 'big' ? 'big' : 'normal'}
      >
        {this.renderThemeIcon()}
      </Menu>
    );
  }

  @bind
  private switchTheme(newTheme: UITheme) {
    const { saveUiTheme } = this.props;
    saveUiTheme(newTheme);
  }

  private renderThemeIcon() {
    const { uiTheme, size } = this.props;
    switch (uiTheme) {
      case 'night':
        return <Icon src={require('./img/night-inline.svg')} className={b('icon', { size })()} />;
      case 'moon':
        return <Icon src={require('./img/moon-inline.svg')} className={b('icon', { size })()} />;
      case 'day':
        return <Icon src={require('./img/day-inline.svg')} className={b('icon', { size })()} />;
      default:
        return null;
    }
  }
}
