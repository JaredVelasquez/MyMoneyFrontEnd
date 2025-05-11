import ApiService from './api.service';
import { authService } from './auth.service';
import { UserService } from './user.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';
import { CurrencyService } from './currency.service';
import { PaymentMethodService } from './payment-method.service';
import { OpenAIService } from './openai.service';
import { AIService } from './ai.service';

// Create service instances
const userService = new UserService();
const transactionService = new TransactionService();
const categoryService = new CategoryService();
const currencyService = new CurrencyService();
const paymentMethodService = new PaymentMethodService();
const apiService = new ApiService();
const openAIService = new OpenAIService();
const aiService = new AIService();

// Export everything
export {
  // Classes
  ApiService,
  UserService,
  TransactionService,
  CategoryService,
  CurrencyService,
  PaymentMethodService,
  OpenAIService,
  AIService,
  
  // Instances
  apiService,
  authService,
  userService,
  transactionService,
  categoryService,
  currencyService,
  paymentMethodService,
  openAIService,
  aiService,
}
