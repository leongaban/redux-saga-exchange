import * as React from 'react';
import block from 'bem-cn';
import ReactModal from 'react-modal';
import Draggable from 'react-draggable';
import { bind } from 'decko';

import './Modal.scss';

interface IProps {
  isOpen: boolean;
  title: React.ReactChild;
  refiningText?: React.ReactNode;
  hasCloseCross?: boolean;
  hasBotttomBorderAtHeader?: boolean;
  withVerticalScroll?: boolean;
  className?: string;
  shouldCloseOnEsc?: boolean;
  onClose?(): void;
}

const b = block('css-modal');

class Modal extends React.PureComponent<IProps> {

  public render() {
    const { isOpen, onClose, withVerticalScroll, className, shouldCloseOnEsc = true } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={`${b()} ${className}`}
        overlayClassName={b('overlay')()}
        ariaHideApp={false}
        overlayRef={this.initOverlayRef}
        shouldCloseOnEsc={shouldCloseOnEsc}
      >
        <Draggable
          handle={`.${b('header')()}`}
          bounds={`.${b()}`}
        >
          <div className={b('content', { 'with-scroll': Boolean(withVerticalScroll) })()}>
            {this.renderHeader()}
            {this.props.children}
          </div>
        </Draggable>
      </ReactModal >
    );
  }

  private renderHeader() {
    const { title, hasCloseCross, onClose, hasBotttomBorderAtHeader, refiningText } = this.props;
    const isCenter = !Boolean(hasCloseCross);
    return (
      <div
        className={b('header', {
          'center': isCenter,
          'with-bottom-border': !!hasBotttomBorderAtHeader,
        })()}
      >

        <div className={b('left-part')()}>
          <div className={b('title')()}>
            {title}
          </div>
          {refiningText && (
            <div className={b('refining-text')()}>
              {refiningText}
            </div>
          )}
        </div>
        {hasCloseCross && (
          <div className={b('cross-wrapper')()}>
            <div onClick={onClose} className={b('cross')()} />
          </div>
        )}
      </div>
    );
  }

  @bind
  private initOverlayRef(overlay: HTMLDivElement | null) {
    if (overlay) {
      overlay.addEventListener('touchmove', this.handleOverlayTouchMove);
    }
  }

  @bind
  private handleOverlayTouchMove(e: TouchEvent) {
    // disable scrolling
    e.preventDefault();
  }
}

export { IProps as IModalProps };
export default Modal;
