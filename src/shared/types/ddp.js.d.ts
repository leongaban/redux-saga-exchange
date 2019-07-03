type TDDPMessage =
  | 'connected'
  | 'disconnected'
  | 'result'
  | 'updated'
  | 'ready'
  | 'nosub'
  | 'added'
  | 'changed'
  | 'removed';

declare class DDP {
  constructor(options: {});
  login: (username: string, password: string) => void;
  on: (messageType: TDDPMessage, callback: Function) => void;
  off: (messageType: TDDPMessage, callback: Function) => void;
  method: (methodName: string, params: any[]) => string;
  sub: (subscriptionName: any, params: any[]) => string;
  unsub: (subscriptionName: any) => string;
  connect: () => void;
  disconnect: () => void;
}

declare module 'ddp.js' {
  export = DDP;
}
