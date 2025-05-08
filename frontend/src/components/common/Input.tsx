import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const inputClass = `
    px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all
    ${error ? 'border-error-500' : 'border-gray-300'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClass} {...props} />
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
    </div>
  );
};

export default Input;