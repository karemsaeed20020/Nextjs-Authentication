import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  register?: UseFormRegisterReturn;
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  register, 
  className,
  type,
  name,
  placeholder,
  ...rest 
}) => {
  const isCheckbox = type === 'checkbox';

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {!isCheckbox && icon && (
          <span className="absolute left-3 text-gray-400">{icon}</span>
        )}

        {isCheckbox ? (
          <input
            type="checkbox"
            id={name}
            name={name}
            {...register} 
            {...rest} 
            className={`w-4 h-4 text-[#E7C9A5] rounded border-gray-300 focus:ring-[#E7C9A5] ${
              error ? 'border-red-500' : 'border-gray-600'
            } bg-gray-700 ${className || ''}`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            {...register}
            {...rest} 
            className={`w-full py-2.5 px-10 rounded-md bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#E7C9A5] ${
              error ? 'border-red-500' : 'border-gray-600'
            } ${className || ''}`}
          />
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;