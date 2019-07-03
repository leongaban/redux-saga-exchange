import SocketsLib from './SocketsLib';

interface IEventPool {
  handlers: { [key: string]: any };
  count: number;
}

/**
 * WebSocket subscription wrapper
 */
class SocketSubscriber {

  private handlers: { [key: string]: IEventPool } = {};
  private ids: { [key: string]: any } = {};
  private globalOffset: number = 0;

  public enterChannel(lib: SocketsLib, channelName: string, eventHandler: any) {
    const id = Date.now() + (this.globalOffset++);
    if (!this.handlers[channelName]) {
      this.handlers[channelName] = {
        handlers: {},
        count: 0,
      };
    }

    const pool = this.handlers[channelName];
    pool.handlers[id] = eventHandler;
    pool.count++;
    this.ids[id] = channelName;
    lib.enterChannel(channelName, eventHandler);
    return {
      id,
      remove: () => {
        delete (pool.handlers[id]);
        delete (this.ids[id]);
        pool.count--;
        if (pool.count <= 0) {
          this.leaveChannel(lib, channelName);
        }
      },
    };
  }

  public leaveChannel(lib: SocketsLib, channelName: string) {
    const pool = this.handlers[channelName];
    if (pool) {
      Object.keys(pool.handlers).map((id: string) => {
        this.clearChannelEventHandler(lib, channelName, pool, id);
      });
      delete (this.handlers[channelName]);
    } else {
      lib.leaveChannel(channelName);
    }
  }

  /**
   * Subscription to WebSocket event
   * @param {SocketsLib} lib Link to SocketsLib object
   * @param {string} eventName Subscription event name
   * @param {function} eventHandler Event handler
   * @returns {number} event ID
   */
  public subscribe(lib: SocketsLib, eventName: string, eventHandler: any) {
    const id = Date.now() + (this.globalOffset++);
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = {
        handlers: {},
        count: 0,
      };
    }
    const pool = this.handlers[eventName];
    pool.handlers[id] = eventHandler;
    pool.count++;
    this.ids[id] = eventName;
    // console.log('[subscribe] [eventName: ' + eventName + ']');
    lib.subscribe(eventName, eventHandler);
    return {
      id,
      remove: () => {
        delete (pool.handlers[id]);
        delete (this.ids[id]);
        pool.count--;
        if (pool.count <= 0) {
          this.unsubscribe(lib, eventName);
        }
      },
    };
  }

  /**
   * Unsubscribe all handlers pointed to event name
   * @param {SocketsLib} lib Link to sockets lib
   * @param {string} eventName event name
   */
  public unsubscribe(lib: SocketsLib, eventName: string) {
    const pool = this.handlers[eventName];
    if (pool) {
      // console.log('[unsubscribe] [eventName: ' + eventName + ']');
      Object.keys(pool.handlers).map((id: string) => {
        this.clearEventHandler(lib, eventName, pool, id);
      });
      delete (this.handlers[eventName]);
    }
  }

  /**
   * Unsubscribe event by id
   * @param {SocketsLib} lib link to sockets lib
   * @param {string} id event ID
   */
  public unsubscribeEvent(lib: SocketsLib, id: string) {
    const eventName = this.ids[id];
    if (eventName != null) {
      const pool: IEventPool = this.handlers[eventName];
      if (pool != null) {
        this.clearEventHandler(lib, eventName, pool, id);
        pool.count--;
        if (pool.count <= 0) {
          this.unsubscribe(lib, eventName);
        }
      }
    }
  }

  /**
   * Clear all handlers subscribed to all events
   * @param {SocketsLib} lib link to sockets lib
   */
  public clearAllSubscriptions(lib: SocketsLib) {
    Object.keys(this.handlers).map((eventName: string) => {
      const pool = this.handlers[eventName];
      Object.keys(pool.handlers).map((id: string) => {
        this.clearEventHandler(lib, eventName, pool, id);
      });
    });
    this.handlers = {};
  }

  private clearEventHandler(lib: SocketsLib, eventName: string, pool: IEventPool, id: string) {
    lib.unsubscribe(eventName, pool.handlers[id]);
    pool.handlers[id] = null;
    delete (this.ids[id]);
    delete (pool.handlers[id]);
  }

  private clearChannelEventHandler(lib: SocketsLib, channelName: string, pool: IEventPool, id: string) {
    lib.leaveChannel(channelName);
    pool.handlers[id] = null;
    delete (this.ids[id]);
    delete (pool.handlers[id]);
  }
}

export default SocketSubscriber;
