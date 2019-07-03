import * as React from 'react';
import * as ReactDOM from 'react-dom';
import block from 'bem-cn';
import { bind } from 'decko';

import './Menu.scss';

type EntryContent = JSX.Element | string;

interface IEntry {
  content: EntryContent;
  onClick(): void;
}

interface IDisabledEntry {
  content: EntryContent;
  renderDisabledEntry(content: EntryContent): EntryContent;
}

type Entry = IEntry | IDisabledEntry;

type EntryHeight = 'small' | 'normal' | 'big';

interface IProps {
  entriesSections: Entry[][];
  scrollableParent?: HTMLElement;
  entryHeight?: EntryHeight;
  withVerticallyArrangedIcon?: boolean;
  menuPosition?: 'left' | 'right';
  onToggle?(): void;
}

interface IState {
  open: boolean;
  listPosition: {
    left: number;
    top: number;
  };
}

const b = block('menu');

class Menu extends React.PureComponent<IProps, IState> {

  public state: IState = {
    open: false,
    listPosition: this.getListPosition(),
  };

  private icon: HTMLDivElement | null = null;
  private list: HTMLDivElement | null = null;

  public componentWillMount() {
    document.body.addEventListener('click', this.handleDocumentBodyClick);
  }

  public componentWillUnmount() {
    document.body.removeEventListener('click', this.handleDocumentBodyClick);
  }

  public render() {
    const { open } = this.state;
    const { children } = this.props;

    return (
      <div className={b({ open })()}>
        <div
          className={b('icon', { highlighted: open })()}
          onClick={this.handleIconClick}
          ref={this.initIcon}
        >
          {children ? children : this.renderCircles()}
        </div>
        {ReactDOM.createPortal(this.renderList(), document.body)}
      </div>
    );
  }

  private renderList() {
    const { open } = this.state;
    const { entriesSections, menuPosition = 'right' } = this.props;

    return (
      <div
        className={b('list', { open, position: menuPosition })()}
        ref={this.initList}
        style={{ ...this.state.listPosition }}
      >
        {entriesSections.map(this.renderEntriesSection)}
      </div>
    );
  }

  @bind
  private getListPosition() {
    if (this.icon && this.list) {
      const { menuPosition } = this.props;
      const iconBoundingClientRect = this.icon.getBoundingClientRect();
      const iconLeft = iconBoundingClientRect.left;
      const iconTop = iconBoundingClientRect.top;
      const iconWidth = iconBoundingClientRect.width;
      const iconHeight = iconBoundingClientRect.height;

      const listWidth = this.list.getBoundingClientRect().width;

      const left = menuPosition === 'right' ? iconLeft : iconLeft - (listWidth - iconWidth);

      return {
        left,
        top: iconTop + iconHeight,
      };
    }
    return {
      left: 0,
      top: 0,
    };
  }

  @bind
  private updateListPosition(callback?: () => void) {
    const listPosition = this.getListPosition();
    this.setState(() => ({ listPosition }), callback);
  }

  @bind
  private renderCircles() {
    const { withVerticallyArrangedIcon } = this.props;
    return (
      <div className={b('circles', { 'vertically-arranged': !!withVerticallyArrangedIcon })()}>
        {[1, 2, 3].map((key) => (
          <div className={b('circles-item')()} key={key} />
        ))}
      </div>
    );
  }

  @bind
  private initIcon(x: HTMLDivElement | null) {
    this.icon = x;
  }

  @bind
  private initList(x: HTMLDivElement | null) {
    this.list = x;
  }

  @bind
  private handleDocumentBodyClick(event: MouseEvent) {
    const { open } = this.state;
    if (this.icon) {
      if (open && !this.icon.contains(event.target as Node)) {
        this.toggleMenu();
      }
    } else {
      console.error('selected option not initialized');
    }
  }

  @bind
  private renderEntriesSection(x: Entry[], index: number) {
    return (
      <section className={b('entries-section')()} key={index}>
        {x.map(this.renderEntry)}
      </section>
    );
  }

  @bind
  private renderEntry(x: Entry, index: number) {
    const { entryHeight = 'normal' } = this.props;

    return isDisabledEntry(x)
      ? (
        <div className={b('disabled-entry', { height: entryHeight })()} key={index}>
          {x.renderDisabledEntry(x.content)}
        </div>
      )
      : (
        <div className={b('entry', { height: entryHeight })()} onClick={x.onClick} key={index}>
          {x.content}
        </div>
      );
  }

  @bind
  private handleIconClick(event: React.MouseEvent<HTMLDivElement>) {
    this.toggleMenu();
    // to avoid event handling in wrappers above, becaues it causes menu closing
    // (handleDocumentBodyClick invokes)
    event.stopPropagation();
    event.preventDefault();
  }

  @bind
  private toggleMenu() {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle();
    }
    this.setState(({ open }: IState) => ({ open: !open }), this.toggleScrollListeners);
  }

  @bind
  private toggleScrollListeners() {
    const { scrollableParent } = this.props;

    const addListeners = () => {
      scrollableParent && scrollableParent.addEventListener('scroll', this.handleScroll);
      window.addEventListener('scroll', this.handleScroll);
    };

    if (this.state.open) {
      this.updateListPosition(addListeners);
    } else {
      scrollableParent && scrollableParent.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  @bind
  private handleScroll() {
    const { scrollableParent } = this.props;
    if (scrollableParent && this.list) {
      const parentBoundingClientRect = scrollableParent.getBoundingClientRect();
      const listBoundingClientRect = this.list.getBoundingClientRect();

      const parentLeft = parentBoundingClientRect.left;
      const parentWidth = parentBoundingClientRect.width;
      const listLeft = listBoundingClientRect.left;
      const listWidth = listBoundingClientRect.width;

      const isParentOverflown = listLeft > parentLeft + parentWidth - listWidth;
      if (isParentOverflown) {
        this.toggleMenu();
      } else {
        this.updateListPosition();
      }
    }
    this.updateListPosition();
  }
}

function isDisabledEntry(entry: Entry): entry is IDisabledEntry {
  return !!(entry as IDisabledEntry).renderDisabledEntry;
}

export { IProps as IMenuProps, Entry as IMenuEntry };
export default Menu;
