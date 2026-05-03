import { useAuthStore } from '../../stores/authStore';
import { useNotifications, useMarkNotifRead } from '../../hooks/useNotifications';
import { useNotifStore } from '../../stores/notifStore';
import { Spinner } from '../../components/ui/Spinner';
import { Bell, CheckCheck, CreditCard, AlertCircle, Info } from 'lucide-react';
import { formatDateTime } from '../../utils/format';
import type { Notification } from '../../types/transaction.types';

const ICON_MAP: Record<string, React.ReactNode> = {
  paiement: <CreditCard size={18} />,
  rappel: <AlertCircle size={18} />,
  systeme: <Info size={18} />,
  litige: <AlertCircle size={18} />,
};

export function NotificationsPage() {
  const user = useAuthStore(s => s.user);
  const { data: notifs, isLoading } = useNotifications(user?.id ?? '');
  const { mutate: markRead } = useMarkNotifRead();
  const { markAllAsRead } = useNotifStore();

  const unread = (notifs ?? []).filter(n => !n.read);

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread.length} non lue(s)</p>
        </div>
        {unread.length > 0 && (
          <button className="btn btn-ghost" id="btn-mark-all-read" onClick={markAllAsRead}>
            <CheckCheck size={18} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {(notifs ?? []).length === 0 ? (
        <div className="empty-state">
          <Bell size={48} className="empty-icon-svg" />
          <h3>Aucune notification</h3>
          <p>Vous êtes à jour !</p>
        </div>
      ) : (
        <div className="notifs-list">
          {(notifs ?? []).map((n: Notification) => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? '' : 'unread'}`}
              id={`notif-${n.id}`}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div className={`notif-icon notif-icon-${n.type}`}>
                {ICON_MAP[n.type] ?? <Bell size={18} />}
              </div>
              <div className="notif-content">
                <p className="notif-title">{n.title}</p>
                <p className="notif-message">{n.message}</p>
                <span className="notif-date">{formatDateTime(n.createdAt)}</span>
              </div>
              {!n.read && <div className="notif-dot" aria-label="Non lu" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
