// Utility functions for unit conversions and data processing

/**
 * Convert various units to standard units
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();
  
  // Same unit
  if (from === to) return value;
  
  // g <-> mg
  if (from === 'g' && to === 'mg') return value * 1000;
  if (from === 'mg' && to === 'g') return value / 1000;
  
  // g <-> mcg (μg)
  if (from === 'g' && to === 'mcg') return value * 1000000;
  if (from === 'mcg' && to === 'g') return value / 1000000;
  
  // mg <-> mcg
  if (from === 'mg' && to === 'mcg') return value * 1000;
  if (from === 'mcg' && to === 'mg') return value / 1000;
  
  return value; // No conversion available
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 1): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Parse number from string (handles Korean formatting)
 */
export function parseNumber(str: string): number | null {
  // Remove common non-numeric characters
  const cleaned = str.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Format number for display
 */
export function formatNumber(value: number, unit: string): string {
  if (unit === 'kcal') {
    return `${Math.round(value)}${unit}`;
  }
  
  if (value >= 1) {
    return `${roundTo(value, 1)}${unit}`;
  }
  
  return `${roundTo(value, 2)}${unit}`;
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9가-힣._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200);
}
