import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>((
  { label, error, helper, className, ...props }, 
  ref
) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={props.id}>
        {label}
      </label>
      <input
        ref={ref}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="mt-1 text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput; 