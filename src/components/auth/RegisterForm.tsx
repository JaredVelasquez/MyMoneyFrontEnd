import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { registerSchema, type RegisterFormValues } from '../../lib/validations/auth';
import { authService } from '../../services';

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: Omit<RegisterFormValues, 'confirmPassword'>) => 
      authService.register(data),
    onSuccess: () => {
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Por favor inicia sesión.'
        } 
      });
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.error || 'Error al registrarse. Intenta nuevamente.'
      );
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
          Full name
        </label>
        <div className="mt-2">
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
          Confirm password
        </label>
        <div className="mt-2">
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm; 