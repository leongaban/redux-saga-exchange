export type TDDPCallData = [string, any[]];

export const ddpLogin = (username: string, digest: string): TDDPCallData => [
  'login',
  [
    {
      user: { username },
      password: {
        digest,
        algorithm: 'sha-256',
      },
    },
  ],
];

export const ddpResume = (token: string): TDDPCallData => [
  'login',
  [
    {
      resume: token,
    },
  ],
];

export const ddpGetRooms = (date: number): TDDPCallData => [
  'rooms/get',
  [
    {
      params: [{ $date: date }],
    },
  ],
];

export const ddpLoadHistory = (roomId: string, date: number = 0): TDDPCallData => [
  'loadHistory',
  [roomId, null, 50, { $date: date }],
];

export const ddpSubscribeRoom = (roomId: string): TDDPCallData => ['stream-room-messages', [roomId, true]];

export const ddpSubscribeRoomEvents = (roomId: string): TDDPCallData => [
  'stream-notify-room',
  [`${roomId}/deleteMessage`, true],
];

export const ddpJoinRoom = (roomId: string): TDDPCallData => ['joinRoom', [roomId]];

export const ddpLeaveRoom = (roomId: string): TDDPCallData => ['leaveRoom', [roomId]];

export const ddpSendMessage = (roomId: string, body: string): TDDPCallData => [
  'sendMessage',
  [
    {
      rid: roomId,
      msg: body,
    },
  ],
];

export const ddpUpdateMessage = (roomId: string, body: string, id: string): TDDPCallData => [
  'updateMessage',
  [
    {
      rid: roomId,
      msg: body,
      _id: id,
    },
  ],
];
