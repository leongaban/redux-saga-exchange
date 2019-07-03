import DDP from 'ddp.js';
import { bind } from 'decko';

import EventEmitter from './EventEmitter';
import {
  TRocketChatEvent,
  IRocketChatOptions,
  IAuthData,
  IRawChatMessage,
  IRawAuthData,
  IDDPChangeMessage,
} from './namespace';
import {
  convertChatMessage,
  convertChannelList,
  IRawChannelList,
  convertAuthMessage,
  convertErrorToChatMessage,
} from './response-converters';
import { sha256 } from './utils';
import {
  ddpLogin,
  ddpResume,
  ddpJoinRoom,
  ddpSubscribeRoom,
  ddpLeaveRoom,
  ddpLoadHistory,
  ddpSendMessage,
  ddpUpdateMessage,
  TDDPCallData,
  ddpSubscribeRoomEvents,
} from './ddp-commands';

const TOKEN_FRESHNESS_CHECK_INTERVAL = 2000;
const TOKEN_FRESHNESS_THRESHOLD = 60000;

const isRealMessage = (message: IRawChatMessage): boolean => message.t === undefined;

class RocketChat extends EventEmitter<TRocketChatEvent> {
  private ddp: DDP;
  private authData: IAuthData;
  private isConnected: boolean;

  private options: IRocketChatOptions;
  private subscribedRoomIDs: Set<string>;
  private subscriptionIdsByRoom: { [key: string]: string };
  private eventSubscriptionIdsByRoom: { [key: string]: string };

  private tokenRefreshTimeout: number;

  constructor(options: IRocketChatOptions) {
    super();
    this.options = options;
    this.subscribedRoomIDs = new Set<string>();
    this.subscriptionIdsByRoom = {};
    this.eventSubscriptionIdsByRoom = {};

    const ddp = new DDP({
      autoConnect: false,
      endpoint: options.wssApiUrl,
      SocketConstructor: WebSocket,
    });

    ddp.on('connected', () => {
      this.isConnected = true;
      this.emit('connected');
    });

    ddp.on('disconnected', () => {
      this.isConnected = false;
      this.emit('disconnected');
    });

    ddp.on('changed', (data: any) => {
      if (data.collection === 'stream-room-messages') {
        const messages = data.fields.args;
        messages.forEach((message: any) => this.handleIncomingMessage(message));
      }
    });

    this.ddp = ddp;
  }

  public connect() {
    if (!this.isConnected) {
      this.ddp.connect();
    }
  }

  public disconnect() {
    if (this.isConnected) {
      this.ddp.disconnect();
    }
  }

  // NOTE: This method uses REST API since it has no equivalent in WSS API.
  // So far (19.11.2018), realtime API returns only joined rooms.
  @bind
  public async getRooms() {
    const response = await this.restRequest<IRawChannelList>('channels.list');
    const roomData = response ? convertChannelList(response) : [];
    return roomData;
  }

  public async getAvatar(userId: string): Promise<string | undefined> {
    const response = await fetch(`${this.options.restApiUrl}/users.getAvatar?userId=${userId}`, { method: 'GET' });
    return response.url || undefined;
  }

  @bind
  public async fetchToken(): Promise<string> {
    const response = await fetch(this.options.loginUrl, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
    const { authToken } = data;
    if (!authToken) {
      throw new Error('no-token');
    }
    return authToken;
  }

  public authSuccessHandler = (result: IRawAuthData) => {
    this.authData = convertAuthMessage(result);
    this.emit('loginSuccess', this.authData);
    this.initTokenRefreshCycle();
  }

  public async login(username: string, password: string) {
    const digest = await sha256(password);
    this.ddpMethodCall(ddpLogin(username, digest), this.authSuccessHandler, this.genericErrorHandler);
  }

  public resume(authToken: string) {
    this.ddpMethodCall(ddpResume(authToken), this.authSuccessHandler, this.genericErrorHandler);
  }

  /**
   * Attempts to join the given room AND subscribes to its feed.
   * These are two independent actions - having joined the room is a server-side
   * state. Subscription (or lack thereof) is client-side. The user may have already
   * joined the room, but - most likely - is not subscribed to it.
   * @param roomId
   */
  public joinRoom(roomId: string): void {
    this.ddpMethodCall(
      ddpJoinRoom(roomId),
      (result: string) => this.emit('joinedRoom', result),
      this.genericErrorHandler,
    );
    this.subscribeRoom(roomId);
  }

  /**
   * Attempts to leave the given room and unsubscribe from its feed.
   * @param roomId
   */
  public leaveRoom(roomId: string): void {
    this.ddpMethodCall(
      ddpLeaveRoom(roomId),
      () => {
        this.emit('leftRoom', roomId);
        this.unsubscribeRoom(roomId);
      },
      this.genericErrorHandler,
    );
  }

  public loadHistory(roomId: string, date: number = 0) {
    this.ddpMethodCall(
      ddpLoadHistory(roomId, date),
      result => {
        this.emit('fetchedHistory', {
          roomId,
          messages: result.messages.filter(isRealMessage).map(convertChatMessage),
        });
      },
      this.genericErrorHandler,
    );
  }

  public sendMessage(roomId: string, body: string) {
    const sanitized = body.trim();
    if (!sanitized) {
      return;
    }
    const errorHandler = (message: any) => {
      this.emit('messageReceived', convertErrorToChatMessage(message, roomId));
    };
    this.ddpMethodCall(ddpSendMessage(roomId, sanitized), undefined, errorHandler);
  }

  public updateMessage(roomId: string, body: string, id: string) {
    this.ddpMethodCall(ddpUpdateMessage(roomId, body, id));
  }

  public ddpMethodCall(
    ddpCallData: TDDPCallData,
    successCallback?: (result: any) => void,
    errorCallback?: (error: any) => void,
    updatedCallback?: (ids: string[]) => void,
  ): string {
    const [name, args] = ddpCallData;
    const methodId = this.ddp.method(name, args);
    /*
      NOTE: In Typescript 3.1.4 the above two lines can be replaced with
      const methodId = this.ddp.method(...ddpCallData);
    */

    const resultHandler = (message: any) => {
      if (message.id === methodId) {
        this.ddp.off('result', resultHandler);

        if (message.error) {
          this.ddp.off('updated', updateHandler);
          if (errorCallback) {
            errorCallback(message.error);
          }
        } else {
          if (successCallback) {
            successCallback(message.result);
          }
        }
      }
    };

    const updateHandler = (message: any) => {
      if (message.id === methodId) {
        this.ddp.off('updated', updateHandler);
        if (updatedCallback) {
          updatedCallback(message.methods);
        }
      }
    };

    this.ddp.on('result', resultHandler);
    if (updatedCallback) {
      this.ddp.on('updated', updateHandler);
    }

    return methodId;
  }

  public ddpSubCall(
    ddpCallData: TDDPCallData,
    successCallback?: (result: any) => void,
    errorCallback?: (error: any) => void,
  ): string {
    const [name, args] = ddpCallData;
    const subId = this.ddp.sub(name, args);
    /*
      NOTE: In Typescript 3.1.4 the above two lines can be replaced with
      const subId = this.ddp.sub(...ddpCallData);
    */

    const resultHandler = (message: any) => {
      if (message.subs && message.subs.includes(subId)) {
        this.ddp.off('ready', resultHandler);
        this.ddp.off('nosub', nosubHandler);
        if (successCallback) {
          successCallback(subId);
        }
      }
    };

    const nosubHandler = (message: any) => {
      if (message.id === subId) {
        this.ddp.off('ready', resultHandler);
        this.ddp.off('nosub', nosubHandler);
        if (errorCallback) {
          errorCallback(message.error);
        }
      }
    };

    this.ddp.on('ready', resultHandler);
    this.ddp.on('nosub', nosubHandler);

    return subId;
  }

  private genericErrorHandler = (error: any) => this.emit('chatError', error);

  private subscribeRoom(roomId: string) {
    const messageSubId = this.ddpSubCall(
      ddpSubscribeRoom(roomId),
      () => {
        this.subscribedRoomIDs.add(roomId);
        this.subscriptionIdsByRoom[roomId] = messageSubId;
        this.emit('subscribedToRoom', roomId);
      },
      error => {
        console.warn(`Couldn't subscribe to room #${roomId} - ${error}`);
      },
    );

    const changeHandler = (data: IDDPChangeMessage) => {
      if (data.collection === 'stream-notify-room' && data.fields.eventName === `${roomId}/deleteMessage`) {
        const messageId = data.fields.args[0]._id;
        this.emit('messageDeleted', { messageId, roomId });
      }
    };

    const eventSubId = this.ddpSubCall(
      ddpSubscribeRoomEvents(roomId),
      () => {
        this.eventSubscriptionIdsByRoom[roomId] = eventSubId;
        this.ddp.on('changed', changeHandler);
      },
      error => {
        console.warn(`Couldn't subscribe to room events #${roomId} - ${error}`);
      },
    );
  }

  private ddpUnsub(
    subscriptionId: string,
    successCallback?: (result: any) => void,
    errorCallback?: (error: any) => void,
  ): void {
    const unsubId = this.ddp.unsub(subscriptionId);

    const resultHandler = (message: any) => {
      if (message.id === unsubId) {
        this.ddp.off('nosub', resultHandler);
        if (message.error) {
          if (errorCallback) {
            errorCallback(message.error);
          }
        } else {
          if (successCallback) {
            successCallback(unsubId);
          }
        }
      }
    };

    this.ddp.on('nosub', resultHandler);
  }

  private unsubscribeRoom(roomId: string) {
    const subId = this.subscriptionIdsByRoom[roomId];
    if (!subId) {
      throw new Error(`No such subscription ID: ${subId}`);
    }

    this.ddpUnsub(
      subId,
      () => {
        this.subscribedRoomIDs.delete(roomId);
        delete this.subscriptionIdsByRoom[roomId];
        this.emit('unsubscribedFromRoom', roomId);
      },
      error => console.warn(`Couldn't unsubscribe from room #${roomId} - ${error}`),
    );

    const eventSubId = this.eventSubscriptionIdsByRoom[roomId];
    this.ddpUnsub(
      eventSubId,
      () => {
        delete this.eventSubscriptionIdsByRoom[roomId];
      },
      error => console.warn(`Couldn't unsubscribe from room events #${roomId} - ${error}`),
    );
  }

  private handleIncomingMessage(rawMessage: IRawChatMessage) {
    const message = convertChatMessage(rawMessage);
    this.emit('messageReceived', message);
  }

  /**
   * Helper method for creating authenticated requests against RC REST API.
   * @param url
   * @param method
   * @param payload
   */
  private async restRequest<T>(url: string, method: 'GET' | 'POST' = 'GET', payload: {} | null = null): Promise<T> {
    const rawResponse = await fetch(`${this.options.restApiUrl}/${url}`, {
      method,
      headers: {
        'X-Auth-Token': this.authData.token,
        'X-User-Id': this.authData.id,
      },
      mode: 'cors',
      body: payload ? JSON.stringify(payload) : null,
    });
    const data =
      rawResponse.headers.get('content-type') === 'application/json' ? await rawResponse.json() : rawResponse.body;
    return data;
  }

  private initTokenRefreshCycle() {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    this.tokenRefreshTimeout = window.setTimeout(() => this.checkTokenFreshness(), TOKEN_FRESHNESS_CHECK_INTERVAL);
  }

  private async refreshToken() {
    try {
      const freshAuthToken = await this.fetchToken();
      this.resume(freshAuthToken);
    } catch (error) {
      console.warn(`Couldn't re-obtain token. Retrying in ${Math.round(TOKEN_FRESHNESS_CHECK_INTERVAL / 1000)}s.`);
    }
  }

  /**
   * Check for expiring tokens. Queues itself (after an interval) or refreshes the token, depending on the result.
   */
  private checkTokenFreshness() {
    if (!this.authData) {
      return;
    }
    const expiresIn = this.authData.tokenExpires - Date.now();
    if (expiresIn < TOKEN_FRESHNESS_THRESHOLD) {
      if (this.tokenRefreshTimeout) {
        clearTimeout(this.tokenRefreshTimeout);
        this.tokenRefreshTimeout = 0;
      }
      this.refreshToken();
      return;
    }
    this.initTokenRefreshCycle();
  }
}

export default RocketChat;
