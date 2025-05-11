# Instrucciones para la Función de Transacciones con IA

## Configuración del API Key de OpenAI

Para utilizar las características de IA en la aplicación, necesitas una clave API de OpenAI:

1. Crea una cuenta en [OpenAI](https://platform.openai.com) si aún no tienes una.
2. Genera una API key desde el panel de control de OpenAI.
3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_API_KEY=tu_api_key_de_openai_aquí
```

## Uso de la función de Transacciones con IA

La nueva función de IA permite crear transacciones automáticamente a partir de:

1. **Mensajes de texto**: Describe una transacción en lenguaje natural como "Gasté 50 euros en un restaurante pagando con tarjeta de crédito".
2. **Imágenes**: Sube una foto de un recibo o factura.

### Cómo usar la función

1. Ve a la pantalla de "Transacciones".
2. Haz clic en "Nueva Transacción".
3. Selecciona la opción "Asistente IA".
4. Puedes:
   - Escribir un mensaje describiendo la transacción, o
   - Subir una imagen de un recibo o factura
5. Haz clic en "Procesar".
6. La IA detectará automáticamente:
   - El monto
   - La categoría
   - El método de pago
   - La moneda
   - La fecha
   - Y otros datos relevantes
7. Una vez procesada, la transacción se guardará automáticamente en el sistema.

### Ejemplos de mensajes efectivos

- "Pagué 45 dólares por una cena en restaurante italiano usando tarjeta de crédito"
- "Recibí 500 pesos de sueldo por transferencia bancaria"
- "Gasté 12 euros en transporte público con efectivo ayer"
- "Me acaba de llegar una transferencia de 200 dólares de mi cliente por un proyecto"

### Procesamiento de imágenes

La función también puede procesar tickets y facturas. Para mejores resultados:
- Asegúrate de que la imagen sea clara y legible
- Incluye el importe total visible
- Incluye la fecha de la transacción visible
- Recorta partes innecesarias

## Solución de problemas

Si encuentras algún problema:

1. **La IA no procesa correctamente tu mensaje**: Sé más específico incluyendo monto, categoría y método de pago.
2. **Error de API**: Verifica que tu API key de OpenAI sea válida y esté correctamente configurada.
3. **La imagen no se procesa correctamente**: Intenta con una imagen más clara o específica el monto manualmente.

## Limitaciones

- La precisión depende de la claridad del mensaje o la calidad de la imagen.
- El procesamiento de imágenes complejas o con mala calidad puede ser limitado.
- Se requiere una conexión a internet activa para usar la función.
- Se aplican los límites de la API de OpenAI según tu plan. 