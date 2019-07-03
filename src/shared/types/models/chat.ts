export interface IServerChatMessage {
  id: number;
  userID: string;
  text: string;
  ts: number;
}

export interface IChatMessage extends IServerChatMessage {
  fullName: string;
  avatarURL: string;
}
