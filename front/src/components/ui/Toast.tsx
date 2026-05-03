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

// Named alias so App.tsx can do: import { Toaster } from './components/ui/Toast'
export { Toast as Toaster };
