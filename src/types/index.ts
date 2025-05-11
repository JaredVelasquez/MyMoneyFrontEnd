// Export all types from their respective files
export * from './user';
export * from './transaction';
export * from './category';
export * from './currency';
export * from './paymentMethod';
export * from './plan';
export * from './subscription';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  category: {
    id: string;
    name: string;
  };
  payment_method: {
    id: string;
    name: string;
  };
  currency: {
    id: string;
    symbol: string;
    code: string;
  };
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
} 