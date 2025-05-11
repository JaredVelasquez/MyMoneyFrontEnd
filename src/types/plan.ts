export type PlanInterval = 'monthly' | 'yearly';

export interface PlanFeature {
  name: string;
  description: string;
  value: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency_id: string;
  interval: PlanInterval;
  features: PlanFeature[];
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatureRequest {
  name: string;
  description: string;
  value: string;
  included: boolean;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  currency_id: string;
  interval: PlanInterval;
  features?: PlanFeatureRequest[];
  is_active?: boolean;
  is_public?: boolean;
  sort_order?: number;
}

export interface UpdatePlanRequest {
  name: string;
  description: string;
  price: number;
  currency_id: string;
  interval: PlanInterval;
  features?: PlanFeatureRequest[];
  is_active?: boolean;
  is_public?: boolean;
  sort_order?: number;
}

export interface PlanResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  currency_id: string;
  interval: string;
  features: PlanFeature[];
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
} 