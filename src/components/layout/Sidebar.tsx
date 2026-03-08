import React, { useMemo } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../mock/employees";

export const Sidebar: React.FC = () => {
  const {
    employees,
    chats,
    activeChatId,
    openDirectChat,
    openGroupChat,
    setActiveChat,
    messagesByChatId
  } = useChat();
  const { currentUser } = useAuth();

  const directChats = useMemo(
    () => chats.filter((c) => c.type === "direct"),
    [chats]
  );
  const groupChats = useMemo(
    () => chats.filter((c) => c.type === "group"),
    [chats]
  );

  const colleagues = useMemo(
    () => employees.filter((e) => e.id !== currentUser?.id),
    [employees, currentUser?.id]
  );

  const getLastMessagePreview = (chatId: string): string => {
    const messages = messagesByChatId[chatId];
    if (!messages || !messages.length) return "Нет сообщений";
    const last = messages[messages.length - 1];
    return last.text.length > 32 ? `${last.text.slice(0, 32)}…` : last.text;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">Группы</div>
        </div>
      </div>
      <ul className="sidebar-list">
        {groupChats.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              className={[
                "sidebar-item",
                activeChatId === chat.id ? "sidebar-item-active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                openGroupChat(chat.id);
                setActiveChat(chat.id);
              }}
            >
              <div
                className="sidebar-item-avatar"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,1), rgba(56,189,248,1))"
                }}
              >
                #{chat.title[0]}
              </div>
              <div className="sidebar-item-content">
                <div className="sidebar-item-title">{chat.title}</div>
                <div className="sidebar-item-subtitle">
                  {getLastMessagePreview(chat.id)}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">Сотрудники</div>
          <div className="sidebar-item-pill">
            {colleagues.length}{" "}
            {colleagues.length === 1 ? "человек" : "сотрудников"}
          </div>
        </div>
      </div>
      <ul className="sidebar-list">
        {colleagues.map((employee) => (
          <li key={employee.id}>
            <button
              type="button"
              className="sidebar-item"
              onClick={() => openDirectChat(employee.id)}
            >
              <div
                className="sidebar-item-avatar"
                style={{ backgroundColor: employee.avatarColor }}
              >
                {getInitials(employee.name)}
              </div>
              <div className="sidebar-item-content">
                <div className="sidebar-item-title">{employee.name}</div>
                <div className="sidebar-item-subtitle">
                  {employee.role} · {employee.department}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

