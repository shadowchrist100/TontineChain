// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDelay } from '../services/apiClient';
import { getNotificationsByUser, MOCK_NOTIFICATIONS } from '../mocks/transactions.mock';
import { useNotifStore } from '../stores/notifStore';

export const useNotifications = (userId: string) => {
  const setNotifications = useNotifStore((s) => s.setNotifications);
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      await mockDelay(300);
      const notifs = getNotificationsByUser(userId);
      setNotifications(notifs);
      return notifs;
    },
    staleTime: 1000 * 30, // 30 secondes (données fréquemment mises à jour)
    enabled: !!userId,
  });
};

export const useMarkNotifRead = () => {
  const queryClient = useQueryClient();
  const markAsRead = useNotifStore((s) => s.markAsRead);
  return useMutation({
    mutationFn: async (id: string) => {
      await mockDelay(200);
      const notif = MOCK_NOTIFICATIONS.find((n) => n.id === id);
      if (notif) notif.read = true;
      return id;
    },
    onSuccess: (id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
