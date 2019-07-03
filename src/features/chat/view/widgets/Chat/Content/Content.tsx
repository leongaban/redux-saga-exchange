import * as React from 'react';
import * as ReactDOM from 'react-dom';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import {
  List,
  AutoSizer,
  ListRowProps,
  CellMeasurer,
  CellMeasurerCache,
  OverscanIndicesGetterParams,
} from 'react-virtualized';
import { bind } from 'decko';
import moment, { Moment } from 'moment';

import { IAppReduxState } from 'shared/types/app';
import { IWidgetContentProps } from 'shared/types/models';
import { required } from 'shared/helpers/validators';
import { TextaeaInputField, ITextareaFieldProps } from 'shared/view/redux-form';
import { Icon, Select } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { actions, selectors, reduxFormEntries } from '../../../../redux';
import { DateFormating, IMessageForm, ChatStatus } from '../../../../namespace';
import { IChatMessage, IRoom } from 'features/chat/chatApi/namespace';

import { Message, Overlay, StatusMessage, ErrorMessage } from '../../../components';

import './Content.scss';

const b = block('chat-widget-content');

const SHOW_STATUS_MESSAGES = false;

interface IStateProps {
  userId: string | null;
  status: ChatStatus;
  chatError: string | null;
  rooms: IRoom[];
  roomId: string | null;
  firstIndexOfToday: number | null;
  messages: IChatMessage[];
  isCacheValid: boolean;
  currentMessage: string;
}

interface IActionProps {
  init: typeof actions.initChat;
  switchRoom: typeof actions.switchRoom;
  sendMessage: typeof actions.sendMessage;
  editMessage: typeof actions.editMessage;
  setCacheValidity: typeof actions.setCacheValidity;
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators(
    {
      init: actions.initChat,
      switchRoom: actions.switchRoom,
      sendMessage: actions.sendMessage,
      editMessage: actions.editMessage,
      setCacheValidity: actions.setCacheValidity,
    },
    dispatch,
  );
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    userId: selectors.selectUserId(state),
    status: selectors.selectStatus(state),
    chatError: selectors.selectError(state),
    rooms: selectors.selectRooms(state),
    roomId: selectors.selectCurrentRoomId(state),
    firstIndexOfToday: selectors.selectFirstIndexOfToday(state),
    messages: selectors.selectCurrentRoomMessages(state),
    isCacheValid: selectors.selectIsCacheValid(state),
    currentMessage: selectors.selectChatFormText(state),
  };
}

type IProps = ITranslateProps &
  IWidgetContentProps &
  IStateProps &
  IActionProps &
  InjectedFormProps<IMessageForm, IWidgetContentProps>;

const {
  chatFormEntry: { name: formName, fieldNames },
} = reduxFormEntries;

class Content extends React.PureComponent<IProps> {
  private cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  private virtualizedList = React.createRef<List>();
  private messageInput = React.createRef<HTMLTextAreaElement & Field<ITextareaFieldProps>>();

  public componentDidMount() {
    this.props.init();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.messages.length !== this.props.messages.length && this.virtualizedList.current) {
      this.virtualizedList.current.scrollToRow(this.props.messages.length);
    }
    if (!this.props.isCacheValid) {
      this.props.setCacheValidity(true);
    }
  }

  public render() {
    const { messages, status, chatError, init, rooms, roomId, isCacheValid, translate: t } = this.props;

    const isDisabled = status !== 'online';

    if (!isCacheValid) {
      this.cache.clearAll();
    }

    const getOptionValue = (option: IRoom): string => (option ? option.name || option.id : '---');
    return (
      <div className={b()}>
        {isDisabled && <Overlay status={status} error={chatError} onConnectClick={init} />}
        <div className={b('channel-picker')()}>
          {rooms && (
            <Select<IRoom>
              optionValueKey={getOptionValue}
              options={rooms}
              selectedOption={rooms.find(room => room.id === roomId) || rooms[0]}
              onSelect={this.handleChannelChange}
              placeholder={t('CHAT:ROOM-SELECTOR:PLACEHOLDER')}
            />
          )}
        </div>
        <div className={b('messages')()}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={this.virtualizedList}
                width={width}
                height={height}
                deferredMeasurementCache={this.cache}
                overscanRowCount={10}
                overscanIndicesGetter={this.getOverscanIndices}
                rowCount={messages.length}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.renderRow}
                style={{ outlineWidth: 0 }}
              />
            )}
          </AutoSizer>
        </div>
        <form className={b('new-message')()} onSubmit={this.handleChatFormSubmit}>
          <div className={b('textarea-and-button')()}>
            <Field<ITextareaFieldProps>
              component={TextaeaInputField}
              name={fieldNames.text}
              className={b('new-message-textarea').mix('tiny-scroll-bar')()}
              placeholder={t('CHAT:TEXTAREA-PLACEHOLDER')}
              onKeyDown={this.handleTextareaKeyDown}
              rows={1}
              maxRows={50}
              validate={[required]}
              maxLength={280}
              disabled={isDisabled}
              withRef={true}
              ref={this.messageInput}
            />
            <button disabled={isDisabled} className={b('send-button')()}>
              <Icon className={b('send-button-icon')()} src={require('../../../images/send-inline.svg')} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  @bind
  private handleChannelChange(room: IRoom): void {
    this.props.switchRoom(room.id);
  }

  @bind
  private renderRow({ index, style, parent, key }: ListRowProps) {
    const content = this.renderRowContent(index, style);
    return (
      <CellMeasurer cache={this.cache} parent={parent} key={key} rowIndex={index} columnIndex={0}>
        {content}
      </CellMeasurer>
    );
  }

  private renderRowContent(index: number, style: React.CSSProperties) {
    const { firstIndexOfToday } = this.props;
    if (index === firstIndexOfToday) {
      return (
        <div style={style}>
          {this.renderDaySeparator(moment())}
          {this.renderMessage('full', index)}
        </div>
      );
    }
    return this.renderMessage('full', index, style);
  }

  private renderDaySeparator(day: Moment) {
    return <div className={b('day-separator')()}>{day.format('dddd, MMMM Do')}</div>;
  }

  private renderMessage(dateFormating: DateFormating, index: number, style?: React.CSSProperties) {
    const message = this.props.messages[index];
    if (message.type === 'message') {
      return (
        <Message
          onEditClick={this.handleEditMessage}
          dateFormating={dateFormating}
          message={message}
          currentUserID={this.props.userId}
          style={style}
        />
      );
    }
    if (message.type === 'error') {
      return <ErrorMessage message={message} style={style} />;
    }
    if (SHOW_STATUS_MESSAGES && (message.type === 'user_joined' || message.type === 'user_left')) {
      return <StatusMessage message={message} style={style} />;
    }
    return null;
  }

  @bind
  private getOverscanIndices({ startIndex, overscanCellsCount, cellCount, stopIndex }: OverscanIndicesGetterParams) {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
    };
  }

  @bind
  private handleEditMessage(message: IChatMessage) {
    this.props.editMessage(message);
    if (this.messageInput && this.messageInput.current) {
      const node = ReactDOM.findDOMNode(this.messageInput.current);
      node && (node as Element).getElementsByTagName('textarea')[0].focus();
    }
  }

  @bind
  private handleTextareaKeyDown(e: any) {
    /*
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        this.props.change('text', this.props.currentMessage + '\n');
        e.preventDefault();
      } else {
        this.props.sendMessage();
        this.props.reset();
        e.preventDefault();
      }
    }
    */
    if (e.key === 'Enter' && !e.shiftKey) {
      this.props.sendMessage();
      this.props.reset();
      e.preventDefault();
    }
  }

  @bind
  private handleChatFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const { handleSubmit, sendMessage } = this.props;
    handleSubmit(() => {
      sendMessage();
    })(e);
  }
}

export default reduxForm<IMessageForm, IWidgetContentProps>({
  form: formName,
  onSubmitSuccess: (result: any, dispatch: Dispatch<any>, props: InjectedFormProps) => {
    props.reset();
  },
})(
  connect(
    mapState,
    mapDispatch,
  )(i18nConnect(Content)),
);
