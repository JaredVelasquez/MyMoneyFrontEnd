import type { Category, PaymentMethod, Currency } from '../types';
import type { TransactionType } from '../types/transaction';

/**
 * Servicio para generar datos mock cuando fallen las llamadas a la API
 */
class MockDataService {
  /**
   * Generar categorías de prueba
   */
  public getCategories(): Category[] {
    return [
      {
        id: "55555555-5555-5555-5555-555555555501",
        name: "Alimentación",
        description: "Gastos en comida y bebida",
        icon: "🍔",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555502",
        name: "Transporte",
        description: "Gastos en movilidad",
        icon: "🚗",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555503",
        name: "Vivienda",
        description: "Gastos relacionados con el hogar",
        icon: "🏠",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555504",
        name: "Salud",
        description: "Gastos médicos y de salud",
        icon: "⚕️",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555505",
        name: "Entretenimiento",
        description: "Gastos en actividades recreativas",
        icon: "🎮",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555601",
        name: "Salario",
        description: "Ingresos por trabajo",
        icon: "💰",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555602",
        name: "Inversiones",
        description: "Rendimientos de inversiones",
        icon: "📈",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55555555-5555-5555-5555-555555555603",
        name: "Regalos",
        description: "Ingresos por regalos recibidos",
        icon: "🎁",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Obtener las categorías de gastos
   */
  public getExpenseCategories(): Category[] {
    // En un escenario real, filtrarías por tipo, por ahora retorna todas las categorías
    return this.getCategories().slice(0, 5);
  }

  /**
   * Obtener las categorías de ingresos
   */
  public getIncomeCategories(): Category[] {
    // En un escenario real, filtrarías por tipo, por ahora retorna categorías de ingresos
    return this.getCategories().slice(5);
  }

  /**
   * Generar métodos de pago de prueba
   */
  public getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Efectivo",
        description: "Pagos en dinero físico",
        icon: "💵",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "33333333-3333-3333-3333-333333333334",
        name: "Tarjeta de crédito",
        description: "Pagos con tarjeta de crédito",
        icon: "💳",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "33333333-3333-3333-3333-333333333335",
        name: "Transferencia bancaria",
        description: "Pagos mediante transferencia",
        icon: "🏦",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Generar monedas de prueba
   */
  public getCurrencies(): Currency[] {
    return [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Dólar estadounidense",
        code: "USD",
        symbol: "$",
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        name: "Euro",
        code: "EUR",
        symbol: "€",
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        name: "Quetzal guatemalteco",
        code: "GTQ",
        symbol: "Q",
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

// Exportar una instancia del servicio
export const mockDataService = new MockDataService(); 