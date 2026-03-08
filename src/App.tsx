import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { MessengerPage } from "./pages/MessengerPage";

export const App = () => {
  const { currentUser, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return <MessengerPage />;
};

