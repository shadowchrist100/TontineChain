import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const sizeMap = { sm: '400px', md: '560px', lg: '720px', xl: '900px' };

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        background: 'rgba(11, 28, 48, 0.5)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms both',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-float)',
          width: '100%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 200ms both',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--color-surface-container-high)',
          }}>
            {title && (
              <h3 id="modal-title" style={{ font: 'var(--text-h3)', color: 'var(--color-on-surface)' }}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Fermer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-surface-container)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-on-surface-variant)',
                  transition: 'background var(--transition-fast)',
                  marginLeft: 'auto',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderTop: '1px solid var(--color-surface-container-high)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Confirmation Modal --- */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  loading = false,
}: ConfirmModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>
      {message}
    </p>
  </Modal>
);
