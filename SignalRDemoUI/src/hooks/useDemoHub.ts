import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type {
  ChatMessage,
  ConnectionState,
  GroupMessage,
  LogEntry,
  LogKind,
  PrivateMessage,
  UserInfo,
} from "../types";

const HUB_URL = "http://localhost:5066/hubs/demo";
export const API_BASE_URL = "http://localhost:5066/api";

let logId = 0;

export function useDemoHub(username: string | null) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [heartbeat, setHeartbeat] = useState<string | null>(null);
  const [systemNotification, setSystemNotification] = useState<string | null>(
    null,
  );
  const [streamValues, setStreamValues] = useState<number[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    count: number;
    lastChunk: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  const appendLog = useCallback((text: string, kind: LogKind = "info") => {
    setLog((prev) => [
      ...prev.slice(-99),
      { id: logId++, timestamp: Date.now(), kind, text },
    ]);
  }, []);

  useEffect(() => {
    if (!username) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_URL}?username=${encodeURIComponent(username)}`)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on(
      "ReceiveMessage",
      (fromUser: string, message: string, scope: string) => {
        setMessages((prev) => [
          ...prev,
          { fromUser, message, scope, timestamp: Date.now() },
        ]);
        appendLog(`[${scope}] ${fromUser}: ${message}`);
      },
    );

    connection.on(
      "ReceivePrivateMessage",
      (fromUser: string, message: string) => {
        setPrivateMessages((prev) => [
          ...prev,
          { fromUser, message, timestamp: Date.now() },
        ]);
        appendLog(`[private] ${fromUser} -> me: ${message}`, "success");
      },
    );

    connection.on(
      "ReceiveGroupMessage",
      (fromUser: string, message: string, groupName: string) => {
        setGroupMessages((prev) => [
          ...prev,
          { fromUser, message, groupName, timestamp: Date.now() },
        ]);
        appendLog(`[group:${groupName}] ${fromUser}: ${message}`);
      },
    );

    connection.on("OnlineUsersUpdated", (users: UserInfo[]) => {
      setOnlineUsers(users);
    });

    connection.on("UserTyping", (typingUsername: string, isStopTyping: boolean = false) => {
      if (isStopTyping) {
        setTypingUser(null)
      } else {
        setTypingUser(typingUsername);
      }
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(
        () => setTypingUser(null),
        2000,
      );
    });

    connection.on(
      "GroupJoined",
      (joinedUsername: string, groupName: string) => {
        appendLog(`"${joinedUsername}" joined group "${groupName}"`, "success");
        if (joinedUsername === username) {
          setJoinedGroups((prev) =>
            prev.includes(groupName) ? prev : [...prev, groupName],
          );
        }
      },
    );

    connection.on("GroupLeft", (leftUsername: string, groupName: string) => {
      appendLog(`"${leftUsername}" left group "${groupName}"`, "warn");
      if (leftUsername === username) {
        setJoinedGroups((prev) => prev.filter((g) => g !== groupName));
      }
    });

    connection.on("ServerHeartbeat", (serverTimeUtc: string) => {
      setHeartbeat(serverTimeUtc);
    });

    connection.on("SystemNotification", (message: string) => {
      setSystemNotification(message);
      appendLog(`[system] ${message}`, "warn");
    });

    connection.on(
      "UploadProgress",
      (chunksReceived: number, lastChunk: string) => {
        setUploadProgress({ count: chunksReceived, lastChunk });
      },
    );

    connection.onreconnecting(() => {
      setConnectionState("reconnecting");
      appendLog("Connection lost, attempting to reconnect...", "warn");
    });

    connection.onreconnected((newConnectionId) => {
      setConnectionState("connected");
      setConnectionId(newConnectionId ?? null);
      appendLog("Reconnected.", "success");
    });

    connection.onclose(() => {
      setConnectionState("disconnected");
      setConnectionId(null);
    });

    setConnectionState("connecting");
    connection
      .start()
      .then(() => {
        setConnectionState("connected");
        setConnectionId(connection.connectionId);
        appendLog(`Connected as "${username}".`, "success");
      })
      .catch((err) => {
        setConnectionState("disconnected");
        appendLog(`Failed to connect: ${err}`, "error");
      });

    return () => {
      connection.stop();
      setJoinedGroups([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const sendToAll = useCallback((message: string) => {
    connectionRef.current?.invoke("SendToAll", message).catch(console.error);
  }, []);

  const sendToOthers = useCallback((message: string) => {
    connectionRef.current
      ?.invoke("SendToOthers", message)
      .catch(console.error);
  }, []);

  const sendToCaller = useCallback((message: string) => {
    connectionRef.current
      ?.invoke("SendToCaller", message)
      .catch(console.error);
  }, []);

  const sendToConnection = useCallback(
    (targetConnectionId: string, message: string) => {
      connectionRef.current
        ?.invoke("SendToConnection", targetConnectionId, message)
        .catch(console.error);
    },
    [],
  );

  const sendPrivate = useCallback((targetUsername: string, message: string) => {
    connectionRef.current
      ?.invoke("SendPrivate", targetUsername, message)
      .catch(console.error);
  }, []);

  const joinGroup = useCallback((groupName: string) => {
    connectionRef.current?.invoke("JoinGroup", groupName).catch(console.error);
  }, []);

  const leaveGroup = useCallback((groupName: string) => {
    connectionRef.current
      ?.invoke("LeaveGroup", groupName)
      .catch(console.error);
  }, []);

  const sendToGroup = useCallback((groupName: string, message: string) => {
    connectionRef.current
      ?.invoke("SendToGroup", groupName, message)
      .catch(console.error);
  }, []);

  const notifyTyping = useCallback((message: string) => {
    connectionRef.current?.send("Typing", message).catch(console.error);
  }, []);

  const startCounterStream = useCallback(
    (count: number) => {
      const connection = connectionRef.current;
      if (!connection) return;
      setStreamValues([]);
      setStreaming(true);
      connection.stream<number>("StreamCounter", count).subscribe({
        next: (value) => setStreamValues((prev) => [...prev, value]),
        error: (err) => {
          appendLog(`Server stream error: ${err}`, "error");
          setStreaming(false);
        },
        complete: () => {
          appendLog("Server -> client stream complete.", "success");
          setStreaming(false);
        },
      });
    },
    [appendLog],
  );

  const startUploadStream = useCallback(
    async (chunks: string[]) => {
      const connection = connectionRef.current;
      if (!connection) return;
      setUploadProgress({ count: 0, lastChunk: "" });
      setUploading(true);

      // The JS client only recognizes a Subject (anything with .subscribe) as
      // a streaming parameter - a plain async generator is not detected, so
      // we push chunks into a Subject by hand instead.
      const subject = new signalR.Subject<string>();
      connection.send("UploadStream", subject).catch((err) => {
        appendLog(`Upload stream error: ${err}`, "error");
      });

      try {
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          subject.next(chunk);
        }
        subject.complete();
        appendLog("Client -> server upload stream finished.", "success");
      } finally {
        setUploading(false);
      }
    },
    [appendLog],
  );

  return {
    connectionState,
    connectionId,
    onlineUsers,
    messages,
    privateMessages,
    groupMessages,
    joinedGroups,
    typingUser,
    heartbeat,
    systemNotification,
    streamValues,
    streaming,
    uploadProgress,
    uploading,
    log,
    appendLog,
    sendToAll,
    sendToOthers,
    sendToCaller,
    sendToConnection,
    sendPrivate,
    joinGroup,
    leaveGroup,
    sendToGroup,
    notifyTyping,
    startCounterStream,
    startUploadStream,
  };
}
