import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { MOCK_USERS } from '../../mocks/users.mock';
import { formatDateTime } from '../../utils/format';
import { Send, Search } from 'lucide-react';

interface Message {
  id: string;
  fromId: string;
  toId: string | 'all';
  text: string;
  at: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', fromId: 'u2', toId: 'all', text: 'Rappel : la prochaine cotisation est due le 5 mai.', at: '2026-05-01T10:00:00Z' },
  { id: 'm2', fromId: 'u1', toId: 'u2', text: 'Bonjour, je confirme mon paiement demain.', at: '2026-05-01T11:30:00Z' },
  { id: 'm3', fromId: 'u3', toId: 'u2', text: 'J\'ai un problème avec mon Mobile Money. Pouvez-vous m\'aider ?', at: '2026-05-02T09:00:00Z' },
];

export function Messagerie() {
  const user = useAuthStore(s => s.user);
  
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedContact, setSelectedContact] = useState<string>('all');
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');

  const contacts = [
    { id: 'all', label: 'Groupe — Tous les membres', subtitle: 'Message à tous' },
    ...MOCK_USERS.filter(u => u.id !== user?.id).map(u => ({
      id: u.id,
      label: `${u.prenom} ${u.nom}`,
      subtitle: u.telephone,
    })),
  ];

  const filteredContacts = contacts.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const conversation = messages.filter(m =>
    selectedContact === 'all'
      ? m.toId === 'all'
      : (m.fromId === selectedContact && m.toId === user?.id) ||
        (m.fromId === user?.id && m.toId === selectedContact)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      fromId: user?.id ?? '',
      toId: selectedContact,
      text: newMsg.trim(),
      at: new Date().toISOString(),
    }]);
    setNewMsg('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Messagerie & Annonces</h1>
      </div>

      <div className="messagerie-layout">
        {/* Sidebar contacts */}
        <div className="messagerie-sidebar card">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="search-contacts"
            />
          </div>
          <div className="contacts-list">
            {filteredContacts.map(c => (
              <button
                key={c.id}
                className={`contact-item ${selectedContact === c.id ? 'active' : ''}`}
                onClick={() => setSelectedContact(c.id)}
                id={`contact-${c.id}`}
              >
                {c.id === 'all' ? (
                  <div className="contact-avatar-group">👥</div>
                ) : (
                  <MemberAvatar
                    nom={MOCK_USERS.find(u => u.id === c.id)?.nom ?? ''}
                    prenom={MOCK_USERS.find(u => u.id === c.id)?.prenom ?? ''}
                    size="sm"
                  />
                )}
                <div className="contact-info">
                  <span className="contact-name">{c.label}</span>
                  <span className="contact-subtitle">{c.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="messagerie-conv card">
          <div className="conv-header">
            <h3 className="conv-title">
              {contacts.find(c => c.id === selectedContact)?.label}
            </h3>
          </div>
          <div className="conv-messages">
            {conversation.length === 0 ? (
              <p className="empty-text">Aucun message dans cette conversation.</p>
            ) : (
              conversation.map(m => {
                const isMe = m.fromId === user?.id;
                const sender = MOCK_USERS.find(u => u.id === m.fromId);
                return (
                  <div key={m.id} className={`msg-bubble-wrap ${isMe ? 'sent' : 'received'}`}>
                    {!isMe && sender && (
                      <MemberAvatar nom={sender.nom} prenom={sender.prenom} size="sm" />
                    )}
                    <div className="msg-bubble">
                      <p className="msg-text">{m.text}</p>
                      <span className="msg-time">{formatDateTime(m.at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <form className="conv-input-row" onSubmit={handleSend}>
            <input
              className="form-input conv-input"
              placeholder="Écrire un message…"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              id="msg-input"
            />
            <button type="submit" className="btn btn-primary btn-sm" id="btn-send-msg" disabled={!newMsg.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
