import { Toaster } from 'sonner';

export const Toast = () => (
  <Toaster
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        borderRadius: 'var(--radius-lg)',
      },
      duration: 4000,
    }}
  />
);
