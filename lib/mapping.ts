// Nutrient name normalization mappings
export const NUTRIENT_MAPPING: Record<string, string[]> = {
  energy: ['열량', '에너지', 'calories', 'energy', 'kcal'],
  protein: ['단백질', 'protein', '프로틴'],
  fat_total: ['지방', '총 지방', 'total fat', 'fat', '지질'],
  fat_saturated: ['포화지방', '포화지방산', 'saturated fat'],
  fat_trans: ['트랜스지방', '트랜스지방산', 'trans fat'],
  carbohydrate: ['탄수화물', 'carbohydrate', 'carbs'],
  sugar: ['당류', 'sugars', '설탕'],
  sodium: ['나트륨', 'sodium', '소듐'],
  cholesterol: ['콜레스테롤', 'cholesterol'],
  fiber: ['식이섬유', 'dietary fiber', 'fiber'],
};

// Reverse mapping for quick lookup
export function normalizeNutrientName(rawName: string): string | null {
  const normalized = rawName.toLowerCase().trim();
  
  for (const [standard, aliases] of Object.entries(NUTRIENT_MAPPING)) {
    if (aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return standard;
    }
  }
  
  return null;
}

// Unit conversions
export function normalizeUnit(rawUnit: string): string {
  const unit = rawUnit.toLowerCase().trim();
  
  if (unit.includes('kcal') || unit.includes('칼로리')) return 'kcal';
  if (unit.includes('mg') || unit.includes('밀리그램')) return 'mg';
  if (unit.includes('g') || unit.includes('그램')) return 'g';
  if (unit.includes('%')) return '%';
  
  return 'g'; // default
}
