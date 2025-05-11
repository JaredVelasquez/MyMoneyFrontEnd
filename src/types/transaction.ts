export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  payment_method_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  type: TransactionType;
  currency_id: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description?: string;
  category_id: string;
  payment_method_id?: string;
  currency_id: string;
  date: string;
  type: TransactionType;
}

export interface UpdateTransactionRequest {
  amount?: number;
  description?: string;
  category_id?: string;
  payment_method_id?: string;
  currency_id?: string;
  date?: string;
  type?: TransactionType;
}

export interface DateRangeRequest {
  start_date: string;
  end_date: string;
} 