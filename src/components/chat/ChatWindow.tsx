import React, { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { MessageInput } from "./MessageInput";

export const ChatWindow: React.FC = () => {
  const { chats, activeChatId, messagesByChatId } = useChat();
  const { currentUser } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChatId ? messagesByChatId[activeChatId] ?? [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeChatId]);

  if (!activeChat || !currentUser) {
    return (
      <div className="chat-layout">
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <div className="chat-empty-title">Выберите чат или сотрудника</div>
          <div className="chat-empty-subtitle">
            Слева доступны общие каналы и список коллег. Начните с личного чата
            с кем-то из команды.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div className="chat-header-title">
          <span className="chat-header-title-main">{activeChat.title}</span>
          <span className="chat-header-title-sub">
            {activeChat.type === "group"
              ? `Групповой чат · участников: ${activeChat.participantIds.length}`
              : "Личный диалог"}
          </span>
        </div>
        <div className="chat-header-meta">
          Сообщений: {messages.length || 0}
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((message) => {
          const isMe = message.senderId === currentUser.id;
          const time = new Date(message.createdAt).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div
              key={message.id}
              className={["chat-message-row", isMe ? "me" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "chat-message-bubble",
                  isMe ? "me" : "other"
                ].join(" ")}
              >
                <div className="chat-message-meta">
                  <span className="chat-message-author">
                    {isMe ? "Вы" : "Собеседник"}
                  </span>
                  <span className="chat-message-time">{time}</span>
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
};

