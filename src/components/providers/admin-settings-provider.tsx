"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Editor" | "Support";
  status: "Active" | "Invited" | "Offline";
};

export type CustomerServiceSettings = {
  liveEnabled: boolean;
  supportHeadline: string;
  supportStatus: string;
  supportHours: string;
  responseTime: string;
  assistantName: string;
};

export type WhatsAppSettings = {
  enabled: boolean;
  number: string;
  label: string;
  defaultMessage: string;
  buttonText: string;
};

export type LiveSupportMessage = {
  id: string;
  sender: "customer" | "support";
  text: string;
  authorName: string;
  createdAt: string;
};

export type LiveSupportConversation = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: LiveSupportMessage[];
};

type AdminSettingsContextValue = {
  users: AdminUser[];
  service: CustomerServiceSettings;
  whatsapp: WhatsAppSettings;
  conversations: LiveSupportConversation[];
  hydrated: boolean;
  saveUser: (user: AdminUser) => void;
  deleteUser: (id: string) => void;
  createDraftUser: () => AdminUser;
  saveService: (settings: CustomerServiceSettings) => void;
  saveWhatsApp: (settings: WhatsAppSettings) => void;
  submitCustomerMessage: (input: {
    conversationId?: string;
    name: string;
    email: string;
    text: string;
  }) => string;
  sendSupportReply: (conversationId: string, text: string) => boolean;
  setConversationStatus: (
    conversationId: string,
    status: LiveSupportConversation["status"],
  ) => void;
};

const USERS_KEY = "mian-tailor-admin-users-v1";
const SERVICE_KEY = "mian-tailor-admin-service-v1";
const WHATSAPP_KEY = "mian-tailor-admin-whatsapp-v1";
const CONVERSATIONS_KEY = "mian-tailor-live-support-conversations-v1";

const defaultUsers: AdminUser[] = [
  {
    id: "admin-1",
    name: "Owner Account",
    email: "owner@miantailor.local",
    role: "Administrator",
    status: "Active",
  },
  {
    id: "editor-1",
    name: "Gallery Editor",
    email: "editor@miantailor.local",
    role: "Editor",
    status: "Active",
  },
  {
    id: "support-1",
    name: "Customer Service",
    email: "support@miantailor.local",
    role: "Support",
    status: "Invited",
  },
];

const defaultService: CustomerServiceSettings = {
  liveEnabled: true,
  supportHeadline: "Live customer service for stitching and gallery enquiries.",
  supportStatus: "Online now",
  supportHours: "Monday to Saturday, 11:00 AM to 9:00 PM",
  responseTime: "Replies within 15 to 30 minutes during service hours",
  assistantName: "Mian Tailor Client Desk",
};

const defaultWhatsApp: WhatsAppSettings = {
  enabled: true,
  number: "+923001234567",
  label: "WhatsApp Customer",
  defaultMessage:
    "Assalam o Alaikum, I want to ask about Shalwar Kameez stitching.",
  buttonText: "Chat on WhatsApp",
};

const defaultConversations: LiveSupportConversation[] = [];

const AdminSettingsContext = createContext<AdminSettingsContextValue | null>(null);

function parseStored<T>(key: string, fallback: T) {
  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function AdminSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);
  const [service, setService] =
    useState<CustomerServiceSettings>(defaultService);
  const [whatsapp, setWhatsapp] =
    useState<WhatsAppSettings>(defaultWhatsApp);
  const [conversations, setConversations] =
    useState<LiveSupportConversation[]>(defaultConversations);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUsers(parseStored<AdminUser[]>(USERS_KEY, defaultUsers));
      setService(parseStored<CustomerServiceSettings>(SERVICE_KEY, defaultService));
      setWhatsapp(parseStored<WhatsAppSettings>(WHATSAPP_KEY, defaultWhatsApp));
      setConversations(
        parseStored<LiveSupportConversation[]>(
          CONVERSATIONS_KEY,
          defaultConversations,
        ),
      );
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [hydrated, users]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(SERVICE_KEY, JSON.stringify(service));
  }, [hydrated, service]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(WHATSAPP_KEY, JSON.stringify(whatsapp));
  }, [hydrated, whatsapp]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      CONVERSATIONS_KEY,
      JSON.stringify(conversations),
    );
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    function handleStorage(event: StorageEvent) {
      if (!event.key) {
        return;
      }

      if (event.key === USERS_KEY) {
        setUsers(parseStored<AdminUser[]>(USERS_KEY, defaultUsers));
      }

      if (event.key === SERVICE_KEY) {
        setService(parseStored<CustomerServiceSettings>(SERVICE_KEY, defaultService));
      }

      if (event.key === WHATSAPP_KEY) {
        setWhatsapp(parseStored<WhatsAppSettings>(WHATSAPP_KEY, defaultWhatsApp));
      }

      if (event.key === CONVERSATIONS_KEY) {
        setConversations(
          parseStored<LiveSupportConversation[]>(
            CONVERSATIONS_KEY,
            defaultConversations,
          ),
        );
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [hydrated]);

  const value = useMemo<AdminSettingsContextValue>(() => {
    return {
      users,
      service,
      whatsapp,
      conversations,
      hydrated,
      saveUser(user) {
        setUsers((current) => {
          const exists = current.some((entry) => entry.id === user.id);
          if (exists) {
            return current.map((entry) => (entry.id === user.id ? user : entry));
          }

          return [user, ...current];
        });
      },
      deleteUser(id) {
        setUsers((current) => current.filter((entry) => entry.id !== id));
      },
      createDraftUser() {
        return {
          id: `user-${Date.now()}`,
          name: "",
          email: "",
          role: "Editor",
          status: "Invited",
        };
      },
      saveService(settings) {
        setService(settings);
      },
      saveWhatsApp(settings) {
        setWhatsapp(settings);
      },
      submitCustomerMessage(input) {
        const trimmedText = input.text.trim();
        const customerName = input.name.trim();
        const customerEmail = input.email.trim();

        if (!trimmedText || !customerName || !customerEmail) {
          return "";
        }

        const now = new Date().toISOString();
        const message: LiveSupportMessage = {
          id: `message-${Date.now()}`,
          sender: "customer",
          text: trimmedText,
          authorName: customerName,
          createdAt: now,
        };

        const resolvedConversationId =
          input.conversationId?.trim() || `conversation-${Date.now()}`;

        setConversations((current) => {
          const byId = current.find(
            (conversation) => conversation.id === resolvedConversationId,
          );

          if (byId) {
            return current.map((conversation) =>
              conversation.id === resolvedConversationId
                ? {
                    ...conversation,
                    customerName,
                    customerEmail,
                    status: "open",
                    updatedAt: now,
                    messages: [...conversation.messages, message],
                  }
                : conversation,
            );
          }

          const nextConversation: LiveSupportConversation = {
            id: resolvedConversationId,
            customerName,
            customerEmail,
            status: "open",
            createdAt: now,
            updatedAt: now,
            messages: [message],
          };

          return [nextConversation, ...current];
        });

        return resolvedConversationId;
      },
      sendSupportReply(conversationId, text) {
        const trimmedText = text.trim();
        const exists = conversations.some(
          (conversation) => conversation.id === conversationId,
        );

        if (!conversationId || !trimmedText || !exists) {
          return false;
        }

        const now = new Date().toISOString();
        const reply: LiveSupportMessage = {
          id: `message-${Date.now()}`,
          sender: "support",
          text: trimmedText,
          authorName: service.assistantName.trim() || "Customer Service",
          createdAt: now,
        };

        setConversations((current) =>
          current.map((conversation) => {
            if (conversation.id !== conversationId) {
              return conversation;
            }

            return {
              ...conversation,
              status: "open",
              updatedAt: now,
              messages: [...conversation.messages, reply],
            };
          }),
        );

        return true;
      },
      setConversationStatus(conversationId, status) {
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : conversation,
          ),
        );
      },
    };
  }, [conversations, hydrated, service, users, whatsapp]);

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);

  if (!context) {
    throw new Error("useAdminSettings must be used within AdminSettingsProvider");
  }

  return context;
}

