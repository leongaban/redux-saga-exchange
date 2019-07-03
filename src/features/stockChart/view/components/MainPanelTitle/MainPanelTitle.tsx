import * as React from 'react';
import { IBlockSettings } from '../../../namespace';
import block from 'bem-cn';
import './MainPanelTitle.scss';

interface IOwnProps {
  open: IBlockSettings;
  close: IBlockSettings;
  high: IBlockSettings;
  low: IBlockSettings;
  date: IBlockSettings;
  symbol: IBlockSettings;
  loadingState: boolean;
  useMobileVersion?: boolean;
}

const b = block('chart-main-panel-title');

class MainPanelTitle extends React.PureComponent<IOwnProps> {
  private titles = this.props.useMobileVersion
    ? { open: 'open', high: 'high', low: 'low', close: 'close' }
    : { open: 'O', high: 'H', low: 'L', close: 'C' };

  public render() {
    const { loadingState } = this.props;
    return (
      <div className={b()}>
        {loadingState ? this.renderLoadingState() : this.renderTitlePanel()}
      </div>
    );
  }

  private renderLoadingState() {
    return (
      <div>&nbsp;</div>
    );
  }

  private renderTitlePanel() {
    const { close, low, high, open, date, useMobileVersion } = this.props;
    return (
      <div className={b('content')()}>
        {!useMobileVersion && <span className={b('date')()}>{date.text}</span>}
        <div className={b('values-group')()}>
          <span className={b('value')()}>
            {this.titles.open}: <span className={b('open')()} style={open.style}>{open.text}</span>
          </span>
          <span className={b('value')()}>
            {this.titles.high}: <span className={b('high')()} style={high.style}>{high.text}</span>
          </span>
        </div>
        <div className={b('values-group')()}>
          <span className={b('value')()}>
            {this.titles.low}: <span className={b('low')()} style={low.style}>{low.text}</span>
          </span>
          <span className={b('value')()}>
            {this.titles.close}: <span className={b('close')()} style={close.style}>{close.text}</span>
          </span>
        </div>
      </div>
    );
  }
}

export default MainPanelTitle;
