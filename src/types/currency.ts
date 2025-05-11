export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  is_active?: boolean;
}

export interface UpdateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  is_active?: boolean;
}

export interface CurrencyResponse {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 