import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Employee, employees } from "../mock/employees";
import { load, save } from "../services/storage";
import { useAuth } from "./AuthContext";

export type ChatType = "direct" | "group";

export type ChatMeta = {
  id: string;
  type: ChatType;
  title: string;
  participantIds: string[];
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type ChatContextValue = {
  employees: Employee[];
  chats: ChatMeta[];
  messagesByChatId: Record<string, Message[]>;
  activeChatId: string | null;
  openDirectChat: (employeeId: string) => void;
  openGroupChat: (groupId: string) => void;
  setActiveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const META_KEY = "chat:meta";
const messagesKey = (chatId: string) => `chat:${chatId}`;

const predefinedGroups: ChatMeta[] = [
  {
    id: "g-all",
    type: "group",
    title: "Общий чат компании",
    participantIds: employees.map((e) => e.id)
  },
  {
    id: "g-dev",
    type: "group",
    title: "Разработка",
    participantIds: employees
      .filter((e) => e.department === "Разработка" || e.department === "Инфраструктура")
      .map((e) => e.id)
  },
  {
    id: "g-hr",
    type: "group",
    title: "HR и People",
    participantIds: employees
      .filter((e) => e.department === "HR" || e.role.toLowerCase().includes("lead"))
      .map((e) => e.id)
  }
];

const ensurePredefinedGroups = (existing: ChatMeta[]): ChatMeta[] => {
  const ids = new Set(existing.map((c) => c.id));
  const missing = predefinedGroups.filter((g) => !ids.has(g.id));
  return existing.concat(missing);
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<ChatMeta[]>([]);
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, Message[]>
  >({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Initial load from localStorage
  useEffect(() => {
    const meta = load<ChatMeta[]>(META_KEY, []);
    const withGroups = ensurePredefinedGroups(meta);
    setChats(withGroups);

    const messagesMap: Record<string, Message[]> = {};
    withGroups.forEach((chat) => {
      messagesMap[chat.id] = load<Message[]>(messagesKey(chat.id), []);
    });
    setMessagesByChatId(messagesMap);
  }, []);

  // Persist meta when chats change
  useEffect(() => {
    if (chats.length) {
      save<ChatMeta[]>(META_KEY, chats);
    }
  }, [chats]);

  const setActiveChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const upsertChat = useCallback((chat: ChatMeta): ChatMeta => {
    setChats((prev) => {
      const exists = prev.find((c) => c.id === chat.id);
      if (exists) {
        return prev;
      }
      return [...prev, chat];
    });
    return chat;
  }, []);

  const openDirectChat = useCallback(
    (employeeId: string) => {
      if (!currentUser) return;
      if (employeeId === currentUser.id) return;

      const ids = [currentUser.id, employeeId].sort();
      const chatId = `d-${ids[0]}-${ids[1]}`;

      const existing =
        chats.find((c) => c.id === chatId) ??
        upsertChat({
          id: chatId,
          type: "direct",
          title: buildDirectTitle(ids),
          participantIds: ids
        });

      // ensure messages array exists
      setMessagesByChatId((prev) => ({
        ...prev,
        [existing.id]: prev[existing.id] ?? []
      }));

      setActiveChatId(existing.id);
    },
    [chats, currentUser, upsertChat]
  );

  const openGroupChat = useCallback(
    (groupId: string) => {
      const meta = chats.find((c) => c.id === groupId);
      if (!meta) return;

      setMessagesByChatId((prev) => ({
        ...prev,
        [groupId]: prev[groupId] ?? []
      }));

      setActiveChatId(groupId);
    },
    [chats]
  );

  const sendMessage = useCallback(
    (chatId: string, text: string) => {
      if (!currentUser) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const msg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chatId,
        senderId: currentUser.id,
        text: trimmed,
        createdAt: new Date().toISOString()
      };

      setMessagesByChatId((prev) => {
        const next = {
          ...prev,
          [chatId]: [...(prev[chatId] ?? []), msg]
        };
        save<Message[]>(messagesKey(chatId), next[chatId]);
        return next;
      });
    },
    [currentUser]
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      employees,
      chats,
      messagesByChatId,
      activeChatId,
      openDirectChat,
      openGroupChat,
      setActiveChat,
      sendMessage
    }),
    [
      chats,
      messagesByChatId,
      activeChatId,
      openDirectChat,
      openGroupChat,
      setActiveChat,
      sendMessage
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
};

const buildDirectTitle = (participantIds: string[]): string => {
  const [firstId, secondId] = participantIds;
  const a = employees.find((e) => e.id === firstId);
  const b = employees.find((e) => e.id === secondId);
  if (a && b) {
    return `${a.name.split(" ")[0]} ↔ ${b.name.split(" ")[0]}`;
  }
  return "Личный чат";
};

