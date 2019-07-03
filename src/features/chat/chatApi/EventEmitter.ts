/*/
 * Simple EventEmitter implementation, mostly lifted from
 * https://gist.github.com/mudge/5830382#gistcomment-2623304
/*/

type Listener = (...args: any[]) => void;

export interface IEventMap {
  [event: string]: Listener[];
}

class EventEmitter<T extends string> {
  private readonly events: IEventMap = {};

  public on(event: T, listener: Listener): () => void {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }

    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  public off(event: T, listener: Listener): void {
    if (typeof this.events[event] !== 'object') {
      return;
    }

    const idx: number = this.events[event].indexOf(listener);
    if (idx > -1) {
      this.events[event].splice(idx, 1);
    }
  }

  public removeAllListeners(): void {
    Object.keys(this.events).forEach((event: T) =>
      this.events[event].splice(0, this.events[event].length),
    );
  }

  public emit(event: T, ...args: any[]): void {
    if (typeof this.events[event] !== 'object') {
      return;
    }

    this.events[event].forEach(listener => listener.apply(this, args));
  }

  public once(event: T, listener: Listener): void {
    const remove: (() => void) = this.on(event, (...args: any[]) => {
      remove();
      listener.apply(this, args);
    });
  }
}

export default EventEmitter;
