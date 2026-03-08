import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { Button } from "../common/Button";

export const MessageInput: React.FC = () => {
  const { activeChatId, sendMessage } = useChat();
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!activeChatId || !value.trim()) return;
    sendMessage(activeChatId, value);
    setValue("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const disabled = !activeChatId || !value.trim();

  return (
    <div className="chat-input-bar">
      <div className="chat-input">
        <input
          className="chat-input-field"
          placeholder={
            activeChatId
              ? "Напишите сообщение и нажмите Enter…"
              : "Выберите чат, чтобы отправить сообщение"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeChatId}
        />
        <Button
          type="button"
          size="icon"
          variant="primary"
          disabled={disabled}
          onClick={handleSend}
        >
          ➤
        </Button>
      </div>
    </div>
  );
};

