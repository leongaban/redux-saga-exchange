import * as React from 'react';
import block from 'bem-cn';
import * as R from 'ramda';
import { bind } from 'decko';

import { Menu, IMenuEntry } from 'shared/view/components';
import { Radio, IRadioProps } from 'shared/view/elements';

import './MenuRadio.scss';

const b = block('menu-radio');

interface IProps extends IRadioProps {
  menuEntries: IMenuEntry[][];
  menuPosition: 'left' | 'right';
  mobile?: boolean;
}

interface IState {
  isMenuOpen: boolean;
}

class MenuRadio extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isMenuOpen: false,
  };

  private get radioProps() {
    return R.omit(['menuEntries', 'menuPosition', 'mobile'], this.props);
  }

  public render() {
    const { mobile } = this.props;
    return (
      <div className={b()}>
        {mobile ? this.renderMobileView() : this.renderDesktopView()}
      </div>
    );
  }

  @bind
  private renderMobileView() {
    return this.renderMenu(this.makeRadioRenderer(this.renderMenuToggle()));
  }

  @bind
  private makeRadioRenderer(icon: JSX.Element) {
    return () => (
      <Radio
        {...this.radioProps}
        onClick={this.handleRadioClick}
        icon={icon}
        withTextAndIcon
      />
    );
  }

  @bind
  private renderDesktopView() {
    return this.makeRadioRenderer(this.renderMenu(this.renderMenuToggle))();
  }

  @bind
  private renderMenuToggle() {
    const { isMenuOpen } = this.state;
    return (
      <div className={b('menu-toggle')()}>
        <div className={b('menu-toggle-icon', { reversed: isMenuOpen })()} />
      </div>
    );
  }

  @bind
  private renderMenu(renderChild: () => JSX.Element) {
    const { menuEntries, menuPosition } = this.props;
    return (
      <Menu
        entriesSections={menuEntries}
        entryHeight="normal"
        menuPosition={menuPosition}
        onToggle={this.handleMenuToggle}
      >
        {renderChild()}
      </Menu>
    );
  }

  @bind
  private handleMenuToggle() {
    this.setState((prevState: IState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  }

  @bind
  private handleRadioClick(event: React.MouseEvent<HTMLInputElement>) {
    const { onClick } = this.props;
    if (onClick) {
      onClick(event);
    }
    // prevent menu click trigger 2 times in a row
    event.stopPropagation();
  }
}

export { IProps as IMenuRadioProps };
export default MenuRadio;
