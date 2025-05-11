/**
 * Formatea una fecha a un formato legible
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Si la fecha es inválida, devolvemos el string original
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatea un valor monetario con el símbolo de moneda
 */
export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
  return `${currencySymbol} ${new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number): string {
  return `${new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)}`;
}

/**
 * Trunca un texto largo
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Formatea una fecha relativa (hoy, ayer, hace X días)
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Si la fecha es inválida, devolvemos el string original
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    return formatDate(dateString);
  }
} 