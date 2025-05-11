export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending' | 'failed';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  renewal_date?: string;
  cancellation_date?: string;
  last_payment_date?: string;
  next_payment_attempt?: string;
  payment_method_id?: string;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  plan_id: string;
  start_date: string;
  end_date: string;
  payment_method_id?: string;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionPaymentMethodRequest {
  payment_method_id: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

export interface ChangePlanRequest {
  plan_id: string;
}

export interface SubscriptionResponse {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  renewal_date?: string;
  cancellation_date?: string;
  last_payment_date?: string;
  next_payment_attempt?: string;
  payment_method_id?: string;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
} 