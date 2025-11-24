// Daily Value reference standards (Korean nutrition labeling)
export const DV_REFERENCE: Record<string, number> = {
  protein: 50, // g
  sodium: 2000, // mg
  sugar: 100, // g
  fat_total: 54, // g
  fat_saturated: 15, // g
  carbohydrate: 324, // g
  fiber: 25, // g
  cholesterol: 300, // mg
};

/**
 * Calculate Daily Value percentage
 * @param nutrient - Nutrient name (standardized)
 * @param value - Nutrient value
 * @param unit - Unit (g or mg)
 * @returns DV percentage (0-1000)
 */
export function calculateDV(nutrient: string, value: number, unit: string = 'g'): number {
  const reference = DV_REFERENCE[nutrient];
  
  if (!reference) {
    return 0;
  }
  
  // Convert to same unit as reference
  let normalizedValue = value;
  if (unit === 'mg' && nutrient !== 'sodium' && nutrient !== 'cholesterol') {
    normalizedValue = value / 1000; // mg to g
  } else if (unit === 'g' && (nutrient === 'sodium' || nutrient === 'cholesterol')) {
    normalizedValue = value * 1000; // g to mg
  }
  
  const dvPercent = (normalizedValue / reference) * 100;
  return Math.round(dvPercent * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate all DV percentages for nutrients
 */
export function calculateAllDV(nutrients: Record<string, { value: number; unit: string }>): Record<string, number> {
  const dv: Record<string, number> = {};
  
  for (const [nutrient, data] of Object.entries(nutrients)) {
    const dvValue = calculateDV(nutrient, data.value, data.unit);
    if (dvValue > 0) {
      dv[nutrient] = dvValue;
    }
  }
  
  return dv;
}
