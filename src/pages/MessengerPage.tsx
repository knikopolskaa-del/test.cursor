import React from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/layout/Sidebar";
import { ChatWindow } from "../components/chat/ChatWindow";
import { Button } from "../components/common/Button";
import { getInitials } from "../mock/employees";

export const MessengerPage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <div className="app-title-badge">
            <div className="app-title-badge-dot" />
          </div>
          <span>Компания · Мессенджер</span>
        </div>
        <div className="app-header-meta">
          <div className="app-user-pill">
            <div
              className="app-user-avatar"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {getInitials(currentUser.name)}
            </div>
            <div>
              <div className="app-user-name">{currentUser.name}</div>
              <div className="app-user-role">{currentUser.role}</div>
            </div>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={logout}>
            Выйти
          </Button>
        </div>
      </header>
      <main className="app-main">
        <Sidebar />
        <ChatWindow />
      </main>
    </div>
  );
};

