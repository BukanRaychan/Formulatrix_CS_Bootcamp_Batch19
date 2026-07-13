import { useState } from "react";
import "./App.css";
import { useDemoHub } from "./hooks/useDemoHub";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { PresencePanel } from "./components/PresencePanel";
import { BroadcastPanel } from "./components/BroadcastPanel";
import { PrivateMessagePanel } from "./components/PrivateMessagePanel";
import { GroupsPanel } from "./components/GroupsPanel";
import { StreamingPanel } from "./components/StreamingPanel";
import { SystemPanel } from "./components/SystemPanel";
import { EventLog } from "./components/EventLog";

function LoginGate({ onConnect }: { onConnect: (username: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="login-gate">
      <h1>SignalR Feature Tour</h1>
      <p>Pick a username to connect. Open this page in a second tab (or an incognito window) with a different name to see the real-time features in action.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onConnect(name.trim());
        }}
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button type="submit" disabled={!name.trim()}>
          Connect
        </button>
      </form>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const hub = useDemoHub(username);

  if (!username) {
    return <LoginGate onConnect={setUsername} />;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>SignalR Feature Tour</h1>
      </header>
      <div className="grid">
        <ConnectionPanel
          username={username}
          connectionState={hub.connectionState}
          connectionId={hub.connectionId}
          onDisconnect={() => setUsername(null)}
        />
        <PresencePanel
          onlineUsers={hub.onlineUsers}
          currentConnectionId={hub.connectionId}
        />
        <BroadcastPanel
          messages={hub.messages}
          typingUser={hub.typingUser}
          onSendToAll={hub.sendToAll}
          onSendToOthers={hub.sendToOthers}
          onSendToCaller={hub.sendToCaller}
          onTyping={hub.notifyTyping}
        />
        <PrivateMessagePanel
          onlineUsers={hub.onlineUsers}
          currentConnectionId={hub.connectionId}
          privateMessages={hub.privateMessages}
          onSendPrivate={hub.sendPrivate}
          onSendToConnection={hub.sendToConnection}
        />
        <GroupsPanel
          joinedGroups={hub.joinedGroups}
          groupMessages={hub.groupMessages}
          onJoinGroup={hub.joinGroup}
          onLeaveGroup={hub.leaveGroup}
          onSendToGroup={hub.sendToGroup}
        />
        <StreamingPanel
          streamValues={hub.streamValues}
          streaming={hub.streaming}
          onStartCounterStream={hub.startCounterStream}
          uploadProgress={hub.uploadProgress}
          uploading={hub.uploading}
          onStartUploadStream={hub.startUploadStream}
        />
        <SystemPanel
          heartbeat={hub.heartbeat}
          systemNotification={hub.systemNotification}
        />
        <EventLog log={hub.log} />
      </div>
    </div>
  );
}

export default App;
