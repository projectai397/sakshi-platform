import React, { useId } from 'react';

/**
 * Accessible Form Input Component
 * Ensures proper labeling, error messages, and ARIA attributes
 */
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function AccessibleInput({
  label,
  error,
  helperText,
  required,
  ...props
}: AccessibleInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="required"> *</span>}
      </label>
      
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      
      {helperText && !error && (
        <p id={helperId} className="helper-text">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Select Component
 */
interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}

export function AccessibleSelect({
  label,
  error,
  options,
  required,
  ...props
}: AccessibleSelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="required"> *</span>}
      </label>
      
      <select
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`form-select ${error ? 'error' : ''}`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={errorId} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Checkbox Component
 */
interface AccessibleCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AccessibleCheckbox({
  label,
  error,
  ...props
}: AccessibleCheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="form-group">
      <div className="checkbox-wrapper">
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`form-checkbox ${error ? 'error' : ''}`}
          {...props}
        />
        <label htmlFor={id} className="checkbox-label">
          {label}
        </label>
      </div>
      
      {error && (
        <p id={errorId} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
