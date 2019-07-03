import * as React from 'react';
import block from 'bem-cn';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IChatMessage } from 'features/chat/chatApi/namespace';

import { TranslateFunction } from 'services/i18n/namespace';

import './ErrorMessage.scss';

const b = block('error-message');

interface IProps {
  message: IChatMessage;
  style?: React.CSSProperties;
}

const I18N: { [key: string]: string } = {
  'You can\'t send messages because you have been muted': 'CHAT:ERROR-MESSAGE:USER-MUTED',
};

function getTranslatedMessage(body: string, translate: TranslateFunction): string {
  const key = I18N[body];
  return key ? translate(key) : body;
}

const ErrorMessage: React.SFC<IProps & ITranslateProps> = ({ message: { type, body }, style, translate }) => (
  <div style={style} className={b()}>
    {getTranslatedMessage(body, translate)}
  </div>
);

export default i18nConnect(ErrorMessage);
