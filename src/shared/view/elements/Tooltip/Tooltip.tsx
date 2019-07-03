import React from 'react';
import ReactDOM from 'react-dom';
import { bind } from 'decko';
import block from 'bem-cn';

import './Tooltip.scss';

const b = block('main-tooltip');

interface IState {
  isOpen: boolean;
  left: number;
  top: number;
}

type TooltipPosition = 'left' | 'right' | 'top' | 'bottom' | 'top-left';

export interface IProps {
  text: string | React.ReactNode;
  position: TooltipPosition;
  withPointer?: boolean;
  inline?: boolean;
  isShown?: boolean;
}

class Tooltip extends React.PureComponent<IProps, IState> {
  public state = {
    isOpen: false,
    left: 0,
    top: 0,
  };

  private tooltipHolder: HTMLDivElement;

  public render() {
    const { children, inline, isShown } = this.props;
    return (
      <div
        className={b({ inline: Boolean(inline) })()}
        ref={this.setWrapElement}
        onMouseEnter={isShown === void 0 ? this.show : void 0}
        onMouseLeave={isShown === void 0 ? this.hide : void 0}
      >
        {children}
        {ReactDOM.createPortal(this.renderContent(), document.body)}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.isShown) {
      this.show();
    }
    document.addEventListener('scroll', this.handleDocumentScroll);
  }

  public componentWillUnmount() {
    document.removeEventListener('scroll', this.handleDocumentScroll);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { isShown: prevIsShown } = prevProps;
    const { isShown } = this.props;
    if (isShown !== prevIsShown) {
      if (isShown) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  private renderContent() {
    const { text, position, withPointer } = this.props;
    const { isOpen, left, top } = this.state;

    return isOpen && (
      <div className={b('content', { position })()} style={{ left, top }}>
        {withPointer && (
          <>
            <div className={b('pointer-fixer', { position })()} />
            <div className={b('pointer', { position })()} />
          </>
        )}
        {text}
      </div>
    );
  }

  @bind
  private setWrapElement(element: HTMLDivElement) {
    this.tooltipHolder = element;
  }

  @bind
  private setVisibility(isOpen: boolean) {
    const rect = this.tooltipHolder.getBoundingClientRect();
    const { position } = this.props;
    this.setState({
      isOpen,
      left: this.getLeftOffset(position, rect),
      top: this.getTopOffset(position, rect),
    });
  }

  @bind
  private handleDocumentScroll() {
    if (this.state.isOpen) {
      const { position } = this.props;
      const rect = this.tooltipHolder.getBoundingClientRect();
      this.setState(prevState => ({
        ...prevState,
        top: this.getTopOffset(position, rect),
      }));
    }
  }

  private getLeftOffset(position: TooltipPosition, holderRect: ClientRect) {
    switch (position) {
    case 'bottom':
    case 'top':
      return holderRect.left + Number((holderRect.width / 2).toFixed(2));
    case 'top-left':
    case 'left':
      return holderRect.left - 8;
    case 'right':
      return holderRect.left + holderRect.width + 8;
    }
  }

  private getTopOffset(position: TooltipPosition, holderRect: ClientRect) {
    switch (position) {
      case 'bottom':
        return holderRect.top + holderRect.height + 14;
      case 'top-left':
      case 'top':
        return holderRect.top - 14;
      case 'left':
      case 'right':
        return holderRect.top + holderRect.height / 2;
    }
  }

  @bind
  private show() {
    this.setVisibility(true);
  }

  @bind
  private hide() {
    this.setVisibility(false);
  }
}

export default Tooltip;
