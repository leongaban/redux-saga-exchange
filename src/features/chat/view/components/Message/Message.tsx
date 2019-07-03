import * as React from 'react';
import block from 'bem-cn';
import moment from 'moment';
import { bind } from 'decko';
import Markdown from 'react-markdown';

import { ITranslateProps, i18nConnect } from 'services/i18n';

import { Icon } from 'shared/view/elements';

import { DateFormating } from '../../../namespace';
import { IChatMessage } from 'features/chat/chatApi/namespace';
import { webchat as webchatConfig } from 'config';

import './Message.scss';

interface IProps {
  message: IChatMessage;
  currentUserID: string | null;
  dateFormating: DateFormating;
  onEditClick: (message: IChatMessage) => void;
  style?: React.CSSProperties;
}

const b = block('message');

class Message extends React.PureComponent<IProps & ITranslateProps> {
  public render() {
    const { message, dateFormating, currentUserID, style, translate: t } = this.props;
    const { author, body, date, edited } = message;
    const editDate = edited
      ? moment(edited.date).format(dateFormating === 'full' ? 'ddd, MMM Do h:mm A' : 'h:mm A')
      : '';
    return (
      <div className={b()} style={style}>
        <img className={b('avatar')()} src={`${webchatConfig.avatarUrl}/${author.name}`} />
        <div className={b('content')()}>
          <div className={b('upper-panel')()}>
            <div className={b('name-and-date')()}>
              <div className={b('name')()}>{author.name}</div>
              <div className={b('date')()}>
                {moment(date).format(dateFormating === 'full' ? 'ddd, MMM Do h:mm A' : 'h:mm A')}
              </div>
            </div>
            {author.id === currentUserID && (
              <div onClick={this.handleEditIconClick}>
                <Icon className={b('edit-icon')()} src={require('../../images/edit-inline.svg')} />
              </div>
            )}
          </div>
          <div className={b('text')()}>
            <Markdown source={body.replace(/\n/g, '  \n')} />
          </div>
          {edited && (
            <div className={b('edited')()}>{t('CHAT:MESSAGE:EDITED-ON', { date: editDate })}</div>
          )}
        </div>
      </div>
    );
  }

  @bind
  private handleEditIconClick() {
    const { onEditClick, message } = this.props;
    onEditClick(message);
  }
}

export default i18nConnect(Message);
