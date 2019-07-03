import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bind } from 'decko';
import block from 'bem-cn';

import './Lightbox.scss';

const b = block('lightbox');

interface IProps {
  children: JSX.Element;
  clickOutside?: boolean;
  clickAnywhere?: boolean;
  onClose(): void;
}

class Lightbox extends React.Component<IProps> {
  public componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  public render() {
    const { children, onClose, clickOutside = true, clickAnywhere = false } = this.props;
    return ReactDOM.createPortal(
      <div className={b()}>
        <div className={b('overlay')()} onClick={clickOutside ? onClose : undefined} />
        <div className={b('content')()} onClick={clickAnywhere ? onClose : undefined}>
          {children}
        </div>
      </div>,
      document.body
    );
  }

  @bind
  private handleKeyDown(event: KeyboardEventInit) {
    if (event.key === 'Escape') {
      this.props.onClose();
    }
  }
}

export default Lightbox;
