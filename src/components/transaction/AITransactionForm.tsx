import React, { useState, useEffect, useRef } from 'react';
import { AIService } from '../../services/ai.service';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { CurrencyService } from '../../services/currency.service';
import { PaymentMethodService } from '../../services/paymentMethod.service';
import type { Category, Currency, PaymentMethod, Transaction } from '../../types';
import type { AITransactionResponse } from '../../services/openai.service';
import type { CreateTransactionRequest } from '../../types/transaction';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

interface AITransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
  onCancel: () => void;
}

const AITransactionForm: React.FC<AITransactionFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [aiResponse, setAiResponse] = useState<AITransactionResponse | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Cargar datos para el contexto
  useEffect(() => {
    const fetchContextData = async () => {
      try {
        setIsLoading(true);
        
        const categoryService = new CategoryService();
        const currencyService = new CurrencyService(true);
        const paymentMethodService = new PaymentMethodService(true);
        
        try {
          const [categoriesResponse, currenciesResponse, paymentMethodsResponse] = await Promise.all([
            categoryService.getAll(),
            currencyService.getAll(),
            paymentMethodService.getAll()
          ]);
          
          setCategories(categoriesResponse.data);
          setCurrencies(currenciesResponse.data);
          setPaymentMethods(paymentMethodsResponse.data);
        } catch (fetchErr) {
          console.error('Error al cargar datos específicos:', fetchErr);
          
          // Intentar cargar cada servicio individualmente para mayor robustez
          try {
            const categoriesResponse = await categoryService.getAll();
            setCategories(categoriesResponse.data);
          } catch (err) {
            console.error('Error al cargar categorías:', err);
            setCategories([]);
          }
          
          try {
            const currenciesResponse = await currencyService.getAll();
            setCurrencies(currenciesResponse.data);
          } catch (err) {
            console.error('Error al cargar monedas:', err);
            setCurrencies([]);
          }
          
          try {
            const paymentMethodsResponse = await paymentMethodService.getAll();
            setPaymentMethods(paymentMethodsResponse.data);
          } catch (err) {
            console.error('Error al cargar métodos de pago:', err);
            setPaymentMethods([]);
          }
          
          setError('No se pudieron cargar algunos datos. La funcionalidad puede estar limitada.');
        }
      } catch (err) {
        console.error('Error al cargar datos de contexto:', err);
        setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContextData();

    // Configurar eventos de drag and drop
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      const preventDefault = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const highlight = () => {
        dropArea.classList.add('border-blue-500', 'bg-blue-50');
      };

      const unhighlight = () => {
        dropArea.classList.remove('border-blue-500', 'bg-blue-50');
      };

      const handleDrop = (e: DragEvent) => {
        preventDefault(e);
        unhighlight();
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileSelect(e.dataTransfer.files[0]);
        }
      };

      dropArea.addEventListener('dragenter', preventDefault);
      dropArea.addEventListener('dragover', preventDefault);
      dropArea.addEventListener('dragleave', unhighlight);
      dropArea.addEventListener('dragenter', highlight);
      dropArea.addEventListener('drop', handleDrop as EventListener);

      return () => {
        dropArea.removeEventListener('dragenter', preventDefault);
        dropArea.removeEventListener('dragover', preventDefault);
        dropArea.removeEventListener('dragleave', unhighlight);
        dropArea.removeEventListener('dragenter', highlight);
        dropArea.removeEventListener('drop', handleDrop as EventListener);
      };
    }
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    
    handleFileSelect(e.target.files[0]);
  };
  
  const handleFileSelect = (selectedFile: File) => {
    // Verificar que sea una imagen
    if (!selectedFile.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    
    setFile(selectedFile);
    
    // Crear URL de vista previa
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    
    // Limpiar cualquier error previo
    setError(null);
  };

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Solicitar permisos para acceder al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Crear grabador de audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Crear un blob con todos los chunks de audio
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'voice-recording.mp3', { type: 'audio/mp3' });
        setAudioFile(audioFile);
        
        // Transcribir el audio
        transcribeAudio(audioFile);
      };
      
      // Iniciar grabación
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error al iniciar la grabación:', err);
      setError('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Detener todas las pistas de audio
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const transcribeAudio = async (audioFile: File) => {
    try {
      setIsTranscribing(true);
      const aiService = new AIService();
      
      // Transcribir el audio
      const transcription = await aiService.transcribeAudio(audioFile);
      
      // Actualizar el mensaje con la transcripción
      setMessage(transcription);
      setIsTranscribing(false);
    } catch (err) {
      console.error('Error al transcribir el audio:', err);
      setError('Error al transcribir el audio. Por favor, intenta de nuevo.');
      setIsTranscribing(false);
    }
  };

  const processTransaction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const aiService = new AIService();
      
      let response;
      
      if (file) {
        // Procesar con imagen
        response = await aiService.processTransactionImage(file);
      } else if (message) {
        // Procesar con mensaje de texto
        response = await aiService.processTransactionText({
          message
        });
      } else {
        throw new Error('Debes proporcionar un mensaje o una imagen');
      }
      
      const responseData = response.data;
      setAiResponse(responseData);
      
      // Si tenemos datos de transacción, la creamos directamente
      if (responseData.transaction) {
        await createTransaction(responseData.transaction);
      }
    } catch (err) {
      console.error('Error al procesar transacción con IA:', err);
      
      // Detallar el error para depuración
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('AITransactionForm - Detalles del error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
        
        // Mostrar mensaje de error del servidor si está disponible
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError('Error al procesar la transacción. Por favor, intenta de nuevo.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al procesar la transacción. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (transactionData: AITransactionResponse['transaction']) => {
    if (!transactionData) return;
    
    try {
      // Usar modo simulado para garantizar que funcione incluso si el backend no está disponible
      const transactionService = new TransactionService(true);
      
      // Crear la transacción usando el tipo correcto
      const createData: CreateTransactionRequest = {
        amount: transactionData.amount,
        description: transactionData.description || 'Transacción generada por IA',
        category_id: transactionData.category_id,
        payment_method_id: transactionData.payment_method_id,
        currency_id: transactionData.currency_id,
        date: transactionData.date,
        type: transactionData.type
      };
      
      const response = await transactionService.create(createData);
      
      console.log('Transacción creada con éxito:', response.data);
      onSuccess(response.data);
    } catch (err) {
      console.error('Error al crear la transacción:', err);
      throw err;
    }
  };

  const resetForm = () => {
    setMessage('');
    setFile(null);
    setPreviewUrl(null);
    setAiResponse(null);
    setError(null);
    setAudioFile(null);
    
    // Resetear el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    // Activar el click en el input file cuando se presiona el área de drop
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Crear transacción con IA</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {aiResponse && !aiResponse.transaction && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{aiResponse.message}</span>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Describe tu transacción
        </label>
        <div className="flex space-x-2">
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={handleMessageChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ej: Gasté 50€ en un restaurante en Barcelona con tarjeta de crédito"
            disabled={isLoading || isRecording || isTranscribing}
          />
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading || isTranscribing}
              className={`p-2 rounded-full ${isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              title={isRecording ? "Detener grabación" : "Grabar voz"}
            >
              {isRecording ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {isTranscribing && (
          <p className="mt-1 text-sm text-blue-600">
            <span className="inline-block animate-spin h-3 w-3 mr-2 border-t-2 border-b-2 border-blue-600 rounded-full"></span>
            Transcribiendo audio...
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Describe tu transacción con detalles como: monto, categoría, método de pago, etc. o utiliza el botón del micrófono para dictarla.
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          O sube una imagen (ticket, factura, etc.)
        </label>
        <div 
          ref={dropAreaRef}
          onClick={handleClickUpload}
          className="border-2 border-dashed border-gray-300 rounded-md px-6 py-10 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          <div className="space-y-2">
            <div className="flex justify-center">
              <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path 
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Haz clic para seleccionar</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>
        
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="Vista previa" className="h-40 object-contain rounded border border-gray-300" />
            <button 
              type="button" 
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="mt-1 text-xs text-red-600 hover:text-red-800"
            >
              Eliminar imagen
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading || isRecording || isTranscribing}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading || isRecording || isTranscribing}
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={processTransaction}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading || isRecording || isTranscribing || (!message && !file)}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
              Procesando...
            </>
          ) : 'Procesar'}
        </button>
      </div>
    </div>
  );
};

export default AITransactionForm; 