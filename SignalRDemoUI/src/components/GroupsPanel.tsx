import { useState } from "react";
import type { GroupMessage } from "../types";

interface Props {
  joinedGroups: string[];
  groupMessages: GroupMessage[];
  onJoinGroup: (groupName: string) => void;
  onLeaveGroup: (groupName: string) => void;
  onSendToGroup: (groupName: string, message: string) => void;
}

export function GroupsPanel({
  joinedGroups,
  groupMessages,
  onJoinGroup,
  onLeaveGroup,
  onSendToGroup,
}: Props) {
  const [groupName, setGroupName] = useState("room-1");
  const [text, setText] = useState("");

  return (
    <section className="panel">
      <h2>Groups</h2>
      <p className="hint">
        <code>Groups.AddToGroupAsync</code> puts a connection into an
        arbitrary named bucket; <code>Clients.Group(name)</code> then
        broadcasts to every connection in it. Groups aren't tracked
        client-side by SignalR &mdash; membership only exists server-side per
        connection.
      </p>
      <div className="row">
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
        />
        <button
          disabled={!groupName.trim() || joinedGroups.includes(groupName)}
          onClick={() => onJoinGroup(groupName.trim())}
        >
          Join
        </button>
        <button
          disabled={!joinedGroups.includes(groupName)}
          onClick={() => onLeaveGroup(groupName.trim())}
        >
          Leave
        </button>
      </div>
      <div className="chip-row">
        {joinedGroups.length === 0 && (
          <span className="hint">Not a member of any group yet.</span>
        )}
        {joinedGroups.map((g) => (
          <span className="badge" key={g}>
            {g}
          </span>
        ))}
      </div>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message to group..."
          disabled={!joinedGroups.includes(groupName)}
        />
        <button
          disabled={!joinedGroups.includes(groupName) || !text.trim()}
          onClick={() => {
            onSendToGroup(groupName.trim(), text.trim());
            setText("");
          }}
        >
          Send to group
        </button>
      </div>
      <ul className="message-list">
        {groupMessages.map((m, i) => (
          <li key={i}>
            <span className="scope-badge scope-group">{m.groupName}</span>
            <strong>{m.fromUser}:</strong> {m.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
