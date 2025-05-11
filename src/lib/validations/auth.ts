import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es obligatorio' })
    .email({ message: 'El email debe tener un formato válido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es obligatoria' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres' }),
  email: z
    .string()
    .min(1, { message: 'El email es obligatorio' })
    .email({ message: 'El email debe tener un formato válido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es obligatoria' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'La confirmación de contraseña es obligatoria' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>; 