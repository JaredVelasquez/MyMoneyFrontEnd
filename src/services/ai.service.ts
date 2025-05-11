import ApiService from './api.service';
import type { AxiosResponse } from 'axios';
import type { AIRequestData, AITransactionResponse } from './openai.service';

export class AIService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Process transaction with AI from text prompt
   */
  public async processTransactionText(data: AIRequestData): Promise<AxiosResponse<AITransactionResponse>> {
    try {
      console.log('AIService - Procesando transacción con texto:', data.message);
      
      // Procesar directamente con OpenAI
      const contextString = this.buildContextString(data.contextData);
      const response = await this.processWithOpenAI(data.message, contextString);
      
      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
    } catch (error) {
      console.error('AIService - Error al procesar transacción con IA (texto):', error);
      throw error;
    }
  }

  /**
   * Process transaction with AI from image
   */
  public async processTransactionImage(image: File, contextData?: AIRequestData['contextData']): Promise<AxiosResponse<AITransactionResponse>> {
    try {
      console.log('AIService - Procesando transacción con imagen');
      
      // Procesar directamente con OpenAI
      const contextString = this.buildContextString(contextData);
      const response = await this.processImageWithOpenAI(image, contextString);
      
      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
    } catch (error) {
      console.error('AIService - Error al procesar transacción con IA (imagen):', error);
      throw error;
    }
  }

  /**
   * Transcribe audio to text using OpenAI API
   */
  public async transcribeAudio(audioFile: File): Promise<string> {
    try {
      console.log('AIService - Transcribiendo audio');
      
      // Procesar directamente con OpenAI
      return await this.transcribeAudioWithOpenAI(audioFile);
    } catch (error) {
      console.error('AIService - Error al transcribir audio:', error);
      throw error;
    }
  }

  /**
   * Build context string for OpenAI
   */
  private buildContextString(contextData?: AIRequestData['contextData']): string {
    if (!contextData) return '';
    
    let context = 'categories:\n';
    context += '| id | name |\n';
    if (contextData.categories && contextData.categories.length > 0) {
      contextData.categories.forEach(category => {
        context += `| ${category.id} | ${category.name} |\n`;
      });
    }
    
    context += '(en caso de que no venga contexto de las categorías el que usarás por defecto es 55555555-5555-5555-5555-555555555505)\n';
    
    context += 'PaymentMethods:\n';
    context += '| id | name |\n';
    if (contextData.paymentMethods && contextData.paymentMethods.length > 0) {
      contextData.paymentMethods.forEach(method => {
        context += `| ${method.id} | ${method.name} |\n`;
      });
    }
    
    context += '(en caso de que no venga el contexto será siempre 33333333-3333-3333-3333-333333333333)\n';
    
    context += 'currencies:\n';
    context += '| id | name |\n';
    if (contextData.currencies && contextData.currencies.length > 0) {
      contextData.currencies.forEach(currency => {
        context += `| ${currency.id} | ${currency.name} |\n`;
      });
    }
    
    context += '(en caso de que no venga contexto por defecto solo usaremos la de a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11)\n';
    
    // Fecha actual en formato ISO
    const currentDate = new Date().toISOString();
    context += `fecha: ${currentDate}\n`;
    context += 'La fecha la deberás inferir en formato string según la fecha actual si no viene\n';
    
    return context;
  }
} 