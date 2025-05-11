import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import OpenAI from 'openai';

// Obtener la URL de la API desde la variable de entorno o desde window.__API_URL__
const API_URL = import.meta.env.VITE_API_URL || window.__API_URL__ || 'http://localhost:8080';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default class ApiService {
  private service: AxiosInstance;
  private authRequired: boolean;
  private openai: OpenAI | null = null;

  constructor(baseURL: string = API_URL, authRequired: boolean = true) {
    this.authRequired = authRequired;
    
    this.service = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    
    // Initialize OpenAI if API key is available
    if (OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.service.interceptors.request.use(
      (config) => {
        if (this.authRequired) {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.service.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired token and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry && this.authRequired) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const newToken = await this.handleTokenRefresh();
            
            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request
            return this.service(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            // If in browser environment, redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Handle token refresh locally without importing from auth.service
  private async handleTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Call the refresh endpoint directly
    const response = await axios.post<{access_token: string}>(`${API_URL}/auth/refresh-token`, {
      refresh_token: refreshToken
    });
    
    const newToken = response.data.access_token;
    localStorage.setItem('accessToken', newToken);
    
    return newToken;
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const fullUrl = `${this.getBaseURL()}${url}`;
    console.log(`Realizando petición GET a: ${fullUrl}`);
    console.log('Headers:', JSON.stringify(this.service.defaults.headers, null, 2));
    
    return this.service.get<T>(url, config)
      .then(response => {
        console.log(`Respuesta exitosa de GET ${url}:`, {
          status: response.status,
          statusText: response.statusText,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          dataLength: Array.isArray(response.data) ? response.data.length : undefined
        });
        return response;
      })
      .catch(error => {
        console.error(`Error en petición GET ${url}:`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        throw error;
      });
  }

  public post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.post<T>(url, data, config);
  }

  public put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.put<T>(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.delete<T>(url, config);
  }

  public patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.patch<T>(url, data, config);
  }

  /**
   * Upload file
   */
  public async uploadFile<T>(url: string, file: File, fieldName: string = 'file', data?: Record<string, string | number | boolean>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      // Add additional data if provided
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }
      
      const mergedConfig = { 
        ...config,
        headers: { 
          ...config?.headers,
          'Content-Type': 'multipart/form-data' 
        }
      };
      
      return await this.service.post<T>(url, formData, mergedConfig);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Download file
   */
  public async downloadFile(url: string, params?: Record<string, unknown>, filename?: string): Promise<void> {
    try {
      const response = await this.service.get(url, {
        params,
        responseType: 'blob',
      });
      
      // Create file link in browser's memory
      const href = URL.createObjectURL(response.data);
      
      // Create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename || this.getFilenameFromResponse(response));
      document.body.appendChild(link);
      link.click();
      
      // Clean up and remove the link
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Extract filename from Content-Disposition header
   */
  private getFilenameFromResponse(response: AxiosResponse<unknown>): string {
    const contentDisposition = response.headers['content-disposition'];
    if (!contentDisposition) return 'download';
    
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return 'download';
  }

  /**
   * Handle response errors
   */
  private handleError(error: unknown): never {
    if (error && typeof error === 'object' && 'response' in error) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const axiosError = error as { 
        response: { 
          data: unknown; 
          status: number; 
          headers: unknown 
        };
        request: unknown;
        message: string;
      };
      
      console.error('Response error:', axiosError.response.data);
      console.error('Status:', axiosError.response.status);
      console.error('Headers:', axiosError.response.headers);
      
      // You can customize error handling based on status codes
      switch (axiosError.response.status) {
        case 400:
          // Bad Request
          break;
        case 401:
          // Unauthorized
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not Found
          break;
        case 500:
          // Internal Server Error
          break;
        default:
          // Other errors
          break;
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      // The request was made but no response was received
      console.error('Request error:', (error as {request: unknown}).request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
    
    throw error;
  }

  /**
   * Get base URL
   */
  public getBaseURL(): string {
    return this.service.defaults.baseURL || '';
  }

  /**
   * Set base URL
   */
  public setBaseURL(url: string): void {
    this.service.defaults.baseURL = url;
  }

  /**
   * Get axios instance
   */
  public getAxiosInstance(): AxiosInstance {
    return this.service;
  }

  /**
   * Process transaction with OpenAI
   */
  public async processWithOpenAI(message: string, context: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const systemContent = "Eres un asistente que partir del mensaje que recibas del usuario, devolverás un JSON con una estructura definida para poder almacenar esa información como una transacción en una aplicación de control de gastos e ingresos.\n\nSi el mensaje del usuario no se puede llevar al json que no puedes responder, ya que hace falta información o porque el usuario mando un mensaje de otro tópico que no nos sirve, responderás con un message breve aclarando cuál es el problema.\n{\n\"transaction\":{\n  \"amount\": 42.99,\n  \"description\": \"Cena en restaurante italiano\",\n  \"category_id\": \"a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78\",\n  \"type\": \"EXPENSE\",\n  \"payment_method_id\": \"987f6543-21ba-4cde-bc43-112233445566\",\n  \"currency_id\": \"123e4567-e89b-12d3-a456-426614174000\",\n  \"date\": \"2025-05-10T20:15:00Z\"\n},\n\"message\": \"este es un mensaje de erro o de exito\"\n}\nEl tipe puede ser EXPENSE o INCOME\ncategory_id, payment_method_id, currency_id, seran provistos por el usuario en su mensaje de manera explícita, con contexto, para que los puedas seleccionar.\n\nLas demás propiedades las deberás inferir del mensaje del usuario\n\nTu respuesta no debe ser otra que el objeto de ejemplo que te pase empezando por { y termiando por }\n";
      const userContent = `<contexto>${context}</contexto>\n<message>${message}</message>`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: systemContent + "\n\nIMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional."
          },
          { role: "user", content: userContent }
        ],
        temperature: 1,
        response_format: { type: "json_object" }
      });

      // Extract the response content
      const responseContent = completion.choices[0]?.message?.content || "{}";
      
      // Parse the JSON string to an object
      try {
        const parsedResponse = JSON.parse(responseContent);
        return parsedResponse;
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        console.log('Response content:', responseContent);
        
        // Si la respuesta no es un JSON válido, intentamos crear una respuesta de error estructurada
        return { 
          message: 'Error al procesar el texto. La respuesta no fue un JSON válido. Por favor, intenta de nuevo con una descripción más clara.'
        };
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Process transaction with OpenAI using image
   */
  public async processImageWithOpenAI(imageFile: File, context: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      const systemContent = "Eres un asistente que partir del mensaje que recibas del usuario, devolverás un JSON con una estructura definida para poder almacenar esa información como una transacción en una aplicación de control de gastos e ingresos.\n\nSi el mensaje del usuario no se puede llevar al json que no puedes responder, ya que hace falta información o porque el usuario mando un mensaje de otro tópico que no nos sirve, responderás con un message breve aclarando cuál es el problema.\n{\n\"transaction\":{\n  \"amount\": 42.99,\n  \"description\": \"Cena en restaurante italiano\",\n  \"category_id\": \"a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78\",\n  \"type\": \"EXPENSE\",\n  \"payment_method_id\": \"987f6543-21ba-4cde-bc43-112233445566\",\n  \"currency_id\": \"123e4567-e89b-12d3-a456-426614174000\",\n  \"date\": \"2025-05-10T20:15:00Z\"\n},\n\"message\": \"este es un mensaje de erro o de exito\"\n}\nEl tipe puede ser EXPENSE o INCOME\ncategory_id, payment_method_id, currency_id, seran provistos por el usuario en su mensaje de manera explícita, con contexto, para que los puedas seleccionar.\n\nLas demás propiedades las deberás inferir del mensaje del usuario\n\nTu respuesta no debe ser otra que el objeto de ejemplo que te pase empezando por { y termiando por }\n";
      const userText = `<contexto>${context}</contexto>\n<message>lee la imagen</message>`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: systemContent + "\n\nIMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional. Si no puedes procesar la imagen, devuelve un JSON con un mensaje de error." 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: userText },
              { 
                type: "image_url", 
                image_url: {
                  url: base64Image,
                  detail: "low"
                } 
              }
            ]
          }
        ],
        max_tokens: 2048,
        response_format: { type: "json_object" }
      });
      
      // Extract the response content
      const responseContent = completion.choices[0]?.message?.content || "{}";
      
      // Parse the JSON string to an object
      try {
        const parsedResponse = JSON.parse(responseContent);
        return parsedResponse;
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        console.log('Response content:', responseContent);
        
        // Si la respuesta no es un JSON válido, intentamos crear una respuesta de error estructurada
        return { 
          message: 'Error al analizar la imagen. La respuesta no fue un JSON válido. Por favor, intenta de nuevo con una imagen más clara.'
        };
      }
    } catch (error) {
      console.error('Error calling OpenAI API with image:', error);
      throw error;
    }
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Transcribe audio with OpenAI
   */
  public async transcribeAudioWithOpenAI(audioFile: File): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Create a Blob from the File
      const blob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
      
      // Create transcript
      const transcript = await this.openai.audio.transcriptions.create({
        file: new File([blob], audioFile.name, { type: audioFile.type }),
        model: "whisper-1",
        language: "es",
        response_format: "text"
      });
      
      // Return the transcription
      return transcript;
    } catch (error) {
      console.error('Error transcribing audio with OpenAI:', error);
      throw error;
    }
  }
} 