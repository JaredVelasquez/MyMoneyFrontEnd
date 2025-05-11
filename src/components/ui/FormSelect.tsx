import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: SelectOption[];
  error?: string;
  helper?: string;
  children?: ReactNode;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>((
  { label, options, error, helper, className, children, ...props },
  ref
) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={props.id}>
        {label}
      </label>
      <select
        ref={ref}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <option value="">Seleccionar...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </>
        )}
      </select>
      {helper && !error && (
        <p className="mt-1 text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect; 