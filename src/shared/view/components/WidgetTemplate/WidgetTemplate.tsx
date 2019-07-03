import * as React from 'react';
import block from 'bem-cn';
import * as R from 'ramda';
import { bind } from 'decko';

import { Icon, WidgetTitle } from 'shared/view/elements';
import { HeaderLeftPartView } from 'shared/types/models'; // TODO header left part is not a model
import { notDraggableClassName } from 'shared/constants';

import './WidgetTemplate.scss';

interface IProps {
  headerLeftPartView: HeaderLeftPartView;
  uid: string;
  title: string;
  scrollable?: boolean;
  onFullscreenSwitch?(): void;
  onCloseClick?(uid: string): void;
  onSettingsClick?(): void;
}

interface IState {
  isFullscreenModeEnabled: boolean;
}

const b = block('widget-template');

class WidgetTemplate extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isFullscreenModeEnabled: false,
  };

  private widget: HTMLDivElement | null = null;

  public componentDidMount() {
    if (this.widget) {
      this.widget.addEventListener('mousedown', this.handleWidgetMousedown);
    }
    document.addEventListener('keyup', this.handleDocumentKeyup);
  }

  public componentWillUnmount() {
    if (this.widget) {
      this.widget.removeEventListener('mousedown', this.handleWidgetMousedown);
    }
    document.removeEventListener('keyup', this.handleDocumentKeyup);
  }

  public render() {
    const {
      children, onCloseClick, onSettingsClick, headerLeftPartView, scrollable = false,
      onFullscreenSwitch,
    } = this.props;
    const { isFullscreenModeEnabled } = this.state;
    return (
      <div
        className={b({ scrollable, fullscreen: isFullscreenModeEnabled })()}
        ref={this.initWidgetRef}
      >
        <div className={b('header', { draggable: !isFullscreenModeEnabled })()}>
          {this.renderHeaderLeftPart(headerLeftPartView)}
          <div className={b('controls').mix(notDraggableClassName)()}>
            {onSettingsClick && this.renderSettingsButton()}
            {onCloseClick && this.renderCloseButton()}
            {onFullscreenSwitch && this.renderFullscreenSwitch()}
          </div>
        </div>
        {children}
      </div>
    );
  }

  private renderSettingsButton() {
    const { onSettingsClick } = this.props;
    if (onSettingsClick) {
      return (
        <div className={b('control')()}>
          <div className={b('settings')()} onClick={onSettingsClick}>
            <Icon className={b('control-icon')()} src={require('./images/settings-inline.svg')} />
          </div>
        </div>
      );
    }
    return null;
  }

  private renderFullscreenSwitch() {
    const iconSrc = this.state.isFullscreenModeEnabled
      ? require('./images/fullscreen-off-inline.svg')
      : require('./images/fullscreen-on-inline.svg');
    return (
      <div className={b('control')()}>
        <div className={b('fullscreen-switch')()} onClick={this.handleFullscreenSwitchClick}>
          <Icon src={iconSrc} className={b('control-icon')()} />
        </div>
      </div>
    );
  }

  private renderCloseButton() {
    const { onCloseClick, uid } = this.props;
    if (onCloseClick) {
      return (
        <div className={b('control')()}>
          <div className={b('close')()} onClick={R.partial(onCloseClick, [uid])}>
            <Icon className={b('control-icon')()} src={require('./images/close-inline.svg')} />
          </div>
        </div>
      );
    }
    return null;
  }

  private renderHeaderLeftPart(x: HeaderLeftPartView) {
    const { title } = this.props;
    switch (x.kind) {
      case 'with-title':
        return <WidgetTitle>{title}</WidgetTitle>;
      case 'with-custom-content':
        return (
          <div className={b('header-content')()}>
            <x.Content />
          </div>
        );
    }
  }

  @bind
  private initWidgetRef(x: HTMLDivElement) {
    this.widget = x;
  }

  @bind
  private handleFullscreenSwitchClick() {
    const { onFullscreenSwitch } = this.props;
    this.setState((prevState: IState) => ({
      isFullscreenModeEnabled: !prevState.isFullscreenModeEnabled,
    }), onFullscreenSwitch);
  }

  @bind
  private handleWidgetMousedown(event: MouseEvent) {
    if (this.state.isFullscreenModeEnabled) {
      event.stopPropagation();
    }
  }

  @bind
  private handleDocumentKeyup(event: KeyboardEvent) {
    const { isFullscreenModeEnabled } = this.state;
    if (event.key === 'Escape' && isFullscreenModeEnabled) {
      this.setState(() => ({
        isFullscreenModeEnabled: false,
      }));
    }
  }
}

export default WidgetTemplate;
export { b };
