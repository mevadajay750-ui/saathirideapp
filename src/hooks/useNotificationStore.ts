import { create } from 'zustand';
import { NotifPayload } from '@/services/notification.service';

export interface InAppNotif extends NotifPayload {
  id: string;
  receivedAt: string;
  isRead: boolean;
}

interface NotifState {
  notifications: InAppNotif[];
  unreadCount: number;

  addNotification: (payload: NotifPayload) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotifState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (payload) => {
    const notif: InAppNotif = {
      ...payload,
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      receivedAt: new Date().toISOString(),
      isRead: false,
    };
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }));
  },

  markRead: (id) => {
    set((s) => {
      const target = s.notifications.find((n) => n.id === id);
      if (!target || target.isRead) return s;

      return {
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      };
    });
  },

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
