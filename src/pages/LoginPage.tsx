import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { employees, getInitials } from "../mock/employees";
import { Button } from "../components/common/Button";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [customName, setCustomName] = useState("");

  const handleEmployeeClick = (id: string) => {
    login(id);
  };

  const handleCustomLogin = () => {
    if (!customName.trim()) return;
    login(customName.trim());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomLogin();
    }
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-header">
          <div className="login-title">Корпоративный мессенджер</div>
          <div className="login-subtitle">
            Выберите себя из списка сотрудников или войдите под произвольным
            именем для теста.
          </div>
        </div>

        <div className="login-employees-grid">
          {employees.map((employee) => (
            <button
              key={employee.id}
              type="button"
              className="login-employee-card"
              onClick={() => handleEmployeeClick(employee.id)}
            >
              <div className="login-employee-header">
                <div
                  className="login-employee-avatar"
                  style={{ backgroundColor: employee.avatarColor }}
                >
                  {getInitials(employee.name)}
                </div>
                <div className="login-employee-main">
                  <div className="login-employee-name">{employee.name}</div>
                  <div className="login-employee-role">{employee.role}</div>
                </div>
              </div>
              <div className="login-employee-dept">{employee.department}</div>
            </button>
          ))}
        </div>

        <div className="login-divider" />

        <div className="login-custom">
          <input
            className="login-input"
            placeholder="Или введите имя для входа..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            size="sm"
            variant="primary"
            disabled={!customName.trim()}
            onClick={handleCustomLogin}
          >
            Войти
          </Button>
        </div>

        <div className="login-footer">
          <span>Только фронтенд, данные хранятся в браузере.</span>
        </div>
      </div>
    </div>
  );
};

