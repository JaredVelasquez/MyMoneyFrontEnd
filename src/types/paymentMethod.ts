export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodRequest {
  name: string;
  description?: string;
}

export interface UpdatePaymentMethodRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
} 