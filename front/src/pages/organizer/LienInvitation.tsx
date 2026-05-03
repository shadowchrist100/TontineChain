import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { Spinner } from '../../components/ui/Spinner';
import { ArrowLeft, Copy, CheckCircle, Share2, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function LienInvitation() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const invitLink = tontine.lienInvitation;
  const whatsappMsg = encodeURIComponent(`Rejoignez ma tontine "${tontine.nom}" sur TontineChain !\n${invitLink}`);
  const emailSubject = encodeURIComponent(`Invitation à rejoindre la tontine "${tontine.nom}"`);
  const emailBody = encodeURIComponent(`Bonjour,\n\nJe vous invite à rejoindre la tontine "${tontine.nom}" sur TontineChain.\n\nLien : ${invitLink}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitLink);
    setCopied(true);
    toast.success('Lien copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 2500);
  };

  // Générer un QR code SVG simple (grid pattern simulé)
  const QRPatternCells = Array.from({ length: 15 }, () =>
    Array.from({ length: 15 }, () => Math.random() > 0.5)
  );

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Lien d'Invitation</h1>
      </div>

      <div className="card invitation-card">
        <h2 className="invitation-tontine">{tontine.nom}</h2>
        <p className="card-desc">Partagez ce lien pour inviter des membres à rejoindre votre tontine.</p>

        {/* QR Code simulé */}
        <div className="qr-container">
          <svg viewBox="0 0 150 150" className="qr-code" aria-label="QR Code d'invitation">
            {/* Coins fixes du QR */}
            {[[0,0],[0,10],[10,0]].map(([rx, ry], i) => (
              <rect key={`corner-${i}`} x={rx+1} y={ry+1} width={9} height={9} rx={1} fill="var(--primary)" />
            ))}
            <rect x={131} y={1} width={9} height={9} rx={1} fill="var(--primary)" />
            <rect x={1} y={131} width={9} height={9} rx={1} fill="var(--primary)" />
            {/* Pattern */}
            {QRPatternCells.map((row, r) =>
              row.map((filled, c) =>
                filled && !(r < 2 && c < 2) && !(r < 2 && c > 12) && !(r > 12 && c < 2) ? (
                  <rect key={`${r}-${c}`} x={c * 10 + 1} y={r * 10 + 1} width={8} height={8} rx={0.5} fill="var(--primary)" opacity={0.85} />
                ) : null
              )
            )}
          </svg>
          <p className="qr-label">Scannez pour rejoindre</p>
        </div>

        {/* Lien copiable */}
        <div className="copy-link-box">
          <code className="link-text">{invitLink}</code>
          <button
            className="btn btn-primary btn-sm"
            id="btn-copy-link"
            onClick={handleCopy}
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>

        {/* Partage */}
        <div className="share-section">
          <h3 className="share-title"><Share2 size={16} /> Partager via</h3>
          <div className="share-buttons">
            <a
              href={`https://wa.me/?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-share whatsapp"
              id="btn-share-whatsapp"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a
              href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
              className="btn btn-share email"
              id="btn-share-email"
            >
              <Mail size={18} /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
