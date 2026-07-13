export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface UserInfo {
  connectionId: string;
  username: string;
}

export interface ChatMessage {
  fromUser: string;
  message: string;
  scope: string;
  timestamp: number;
}

export interface PrivateMessage {
  fromUser: string;
  message: string;
  timestamp: number;
}

export interface GroupMessage {
  fromUser: string;
  message: string;
  groupName: string;
  timestamp: number;
}

export type LogKind = "info" | "success" | "warn" | "error";

export interface LogEntry {
  id: number;
  timestamp: number;
  kind: LogKind;
  text: string;
}
