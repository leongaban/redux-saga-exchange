import * as React from 'react';
import block from 'bem-cn';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IChatMessage, MessageType } from 'features/chat/chatApi/namespace';

import { TranslateFunction } from 'services/i18n/namespace';

import './StatusMessage.scss';

const b = block('status-message');

interface IProps {
  message: IChatMessage;
  style?: React.CSSProperties;
}

function getI18NKeyByMessageType(msgType: MessageType): string | undefined {
  switch (msgType) {
    case 'user_joined': return 'CHAT:STATUS-MESSAGE:USER-JOINED';
    case 'user_left': return 'CHAT:STATUS-MESSAGE:USER-LEFT';
    default: return undefined;
  }
}

function getMessage(translate: TranslateFunction, msgType: MessageType, body: string): string {
  const key = getI18NKeyByMessageType(msgType);
  return key ? translate(key, {username: body}) : body;
}

const StatusMessage: React.SFC<IProps & ITranslateProps> = ({ message: { type, body }, style, translate }) => (
  <div style={style} className={b()}>
    {getMessage(translate, type, body)}
  </div>
);

export default i18nConnect(StatusMessage);
