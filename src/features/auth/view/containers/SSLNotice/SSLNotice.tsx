import * as React from 'react';
import { connect } from 'react-redux';
import block from 'bem-cn';
import InlineSVG from 'svg-inline-react';

import { IAppReduxState } from 'shared/types/app';
import { selectors as configSelectors } from 'services/config';

import { TranslateMarkdown } from 'services/i18n';

import './SSLNotice.scss';

const b = block('ssl-notice');

interface IStateProps {
  browserName: string | undefined;
  userOS: string | undefined;
}

interface IOwnProps {
  style?: React.CSSProperties;
  className?: string;
}

type IProps = IOwnProps & IStateProps;

function mapState(state: IAppReduxState) {
  return {
    browserName: configSelectors.selectBrowserName(state),
    userOS: configSelectors.selectUserOS(state),
  };
}

const IMAGE_SETS: { [key: string]: { [key: string]: string } } = {
  Chrome: {
    'Mac OS': 'chrome.png',
    'Android': 'android-chrome.png',
    'default': 'chrome.png',
  },
  Safari: {
    default: 'safari.png',
  },
  Firefox: {
    default: 'firefox.png',
  },
  /*
  'Android Browser': {
    default: '...',
  },
  'Opera': {
    default: '...',
  },
  'Edge': {
    default: '...',
  },
  */
  default: {
    default: 'chrome.png'
  }
};

const ADDRESS = 'https://exchange.trd.io';

function getImage(browserName: string | undefined, os: string | undefined): string {
  const browserImageSet = IMAGE_SETS[browserName || 'default'] || IMAGE_SETS.default;
  return browserImageSet[os || 'default'] || browserImageSet.default;
}

const SSLNotice: React.SFC<IProps> = ({ className, style, browserName, userOS }: IProps) => (
  <div style={style} className={[b(), className].filter(Boolean).join(' ')}>
    <div>
      <InlineSVG src={require('./error-inline.svg')} className={b('icon')()} />
      <TranslateMarkdown stringKey="AUTH:SSL-NOTICE" args={{ address: ADDRESS }} />
    </div>
    <div className={b('image-wrapper')()}>
      <div
        className={b('image')()}
        style={{ backgroundImage: `url(../img/ssl-notice/${getImage(browserName + 'o', userOS + 'x')})` }}
      />
    </div>
  </div>
);

export default connect(mapState)(SSLNotice);
