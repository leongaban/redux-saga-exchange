import * as React from 'react';
import block from 'bem-cn';
import { Icon } from 'shared/view/elements';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { ChatStatus } from 'features/chat/namespace';

import './Overlay.scss';

interface IOverlayProps {
  status: ChatStatus;
  error: string | null;
  onConnectClick: () => void;
}

const b = block('chat-widget-overlay');

const ERROR_CODE_USER_BANNED = 'error-user-is-not-activated';

const ERROR_TRANSLATIONS: {[key: string]: string} = {
  [ERROR_CODE_USER_BANNED]: 'CHAT:ERROR-MESSAGE:USER-BANNED',
};

function getI18NKeyByStatus(chatStatus: ChatStatus): string {
  switch (chatStatus) {
    case 'connecting':
    return 'CHAT:OVERLAY:STATUS-CONNECTING';
    case 'offline':
    return 'CHAT:OVERLAY:STATUS-OFFLINE';
    default:
      const badStatus: never | 'online' = chatStatus;
      console.warn('Unexpected chat status:', badStatus);
      return 'CHAT:OVERLAY:STATUS-OFFLINE';
  }
}

const Overlay: React.SFC<IOverlayProps> = ({
  status,
  error,
  onConnectClick,
  translate,
}: IOverlayProps & ITranslateProps) => (
  <div className={b()}>
    <div className={b('content')()}>
      <Icon src={require('../../images/offline-inline.svg')} className={b('image')()} />
      {translate(getI18NKeyByStatus(status))}
      {error && status === 'offline' && <div className={b('error')()}>{
        translate(ERROR_TRANSLATIONS[error] || 'CHAT:ERROR-MESSAGE:GENERIC')
      }</div>}
      {status === 'offline' && error !== ERROR_CODE_USER_BANNED && (
        <div>
          <button onClick={onConnectClick}>{translate('CHAT:OVERLAY:BTN-LABEL-RECONNECT')}</button>
        </div>
      )}
    </div>
  </div>
);

export default i18nConnect(Overlay);
