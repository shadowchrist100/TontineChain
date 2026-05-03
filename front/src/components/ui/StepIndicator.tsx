import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 'var(--space-8)' }}>
    {steps.map((step, index) => {
      const isCompleted = step.id < currentStep;
      const isCurrent   = step.id === currentStep;
      const isLast      = index === steps.length - 1;

      return (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-headline)',
              fontWeight: 700,
              fontSize: '14px',
              transition: 'all var(--transition-base)',
              background: isCompleted
                ? 'var(--color-secondary)'
                : isCurrent
                ? 'var(--color-primary)'
                : 'var(--color-surface-container)',
              color: isCompleted || isCurrent
                ? '#fff'
                : 'var(--color-on-surface-variant)',
              border: isCurrent ? '2px solid var(--color-primary)' : '2px solid transparent',
            }}>
              {isCompleted ? <Check size={16} /> : step.id}
            </div>
            <span style={{
              font: 'var(--text-body-sm)',
              fontWeight: isCurrent ? 700 : 400,
              color: isCurrent
                ? 'var(--color-on-surface)'
                : isCompleted
                ? 'var(--color-secondary)'
                : 'var(--color-on-surface-variant)',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}>
              {step.label}
            </span>
          </div>
          {!isLast && (
            <div style={{
              flex: 1,
              height: '2px',
              margin: '0 var(--space-2)',
              marginBottom: 'var(--space-5)',
              background: isCompleted ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
              transition: 'background var(--transition-base)',
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);
