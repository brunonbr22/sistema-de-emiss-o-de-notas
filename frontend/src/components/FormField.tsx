import { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s/g, '-');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor={fieldId} style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          style={{
            padding: '10px 12px',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 15,
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: 13, color: 'var(--color-error)' }}>{error}</span>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
