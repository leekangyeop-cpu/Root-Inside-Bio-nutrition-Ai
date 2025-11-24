/**
 * 약사 관점의 건강기능식품 분석 모듈
 * KFDA 기준 상세 검증 및 전문가 수준의 평가
 */

import { FUNCTIONAL_INGREDIENTS, FunctionalIngredient } from './functional-ingredients';
import { NUTRIENT_STANDARDS, evaluateNutrient } from './nutrient-standards';

export interface IngredientAnalysis {
  name: string;
  koreanName: string;
  detectedAmount: number;
  unit: string;
  dailyIntakeRange: string;
  status: 'deficient' | 'optimal' | 'excessive' | 'dangerous';
  compliancePercentage: number;
  kfdaApproval: boolean;
  functionality: string[];
  precautions: string[];
  targetGroup: string[];
  pharmacistNote: string;
}

export interface ComplianceIssue {
  severity: 'critical' | 'warning' | 'info';
  ingredient: string;
  issue: string;
  recommendation: string;
  kfdaReference: string;
}

export interface PharmacistAnalysisResult {
  overallRating: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  complianceScore: number; // 0-100
  analyzedIngredients: IngredientAnalysis[];
  complianceIssues: ComplianceIssue[];
  drugInteractions: string[];
  contraindicatedFor: string[];
  appropriateFor: string[];
  dosageGuidance: string;
  professionalRecommendation: string;
  regulatoryStatus: {
    kfdaCompliant: boolean;
    healthFunctionalFood: boolean;
    requiresPrescription: boolean;
    ageRestrictions: string[];
  };
}

/**
 * 성분명 표준화 (다양한 표기법을 표준 키로 변환)
 */
function normalizeIngredientName(name: string): string | null {
  const normalized = name.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
  
  const mappings: Record<string, string> = {
    '비타민a': 'vitamin_a',
    'vitamina': 'vitamin_a',
    'retinol': 'vitamin_a',
    '레티놀': 'vitamin_a',
    
    '비타민b1': 'vitamin_b1',
    'vitaminb1': 'vitamin_b1',
    '티아민': 'vitamin_b1',
    'thiamin': 'vitamin_b1',
    'thiamine': 'vitamin_b1',
    
    '비타민b2': 'vitamin_b2',
    'vitaminb2': 'vitamin_b2',
    '리보플라빈': 'vitamin_b2',
    'riboflavin': 'vitamin_b2',
    
    '비타민b3': 'vitamin_b3',
    'vitaminb3': 'vitamin_b3',
    '나이아신': 'vitamin_b3',
    'niacin': 'vitamin_b3',
    
    '비타민b5': 'vitamin_b5',
    'vitaminb5': 'vitamin_b5',
    '판토텐산': 'vitamin_b5',
    'pantothenicacid': 'vitamin_b5',
    
    '비타민b6': 'vitamin_b6',
    'vitaminb6': 'vitamin_b6',
    'pyridoxine': 'vitamin_b6',
    '피리독신': 'vitamin_b6',
    
    '비타민b7': 'vitamin_b7',
    'vitaminb7': 'vitamin_b7',
    '비오틴': 'vitamin_b7',
    'biotin': 'vitamin_b7',
    
    '비타민b9': 'vitamin_b9',
    'vitaminb9': 'vitamin_b9',
    '엽산': 'vitamin_b9',
    'folicacid': 'vitamin_b9',
    'folate': 'vitamin_b9',
    
    '비타민b12': 'vitamin_b12',
    'vitaminb12': 'vitamin_b12',
    'cobalamin': 'vitamin_b12',
    '코발라민': 'vitamin_b12',
    
    '비타민c': 'vitamin_c',
    'vitaminc': 'vitamin_c',
    'ascorbicacid': 'vitamin_c',
    '아스코르브산': 'vitamin_c',
    
    '비타민d': 'vitamin_d',
    'vitamind': 'vitamin_d',
    'cholecalciferol': 'vitamin_d',
    '콜레칼시페롤': 'vitamin_d',
    
    '비타민e': 'vitamin_e',
    'vitamine': 'vitamin_e',
    'tocopherol': 'vitamin_e',
    '토코페롤': 'vitamin_e',
    
    '비타민k': 'vitamin_k',
    'vitamink': 'vitamin_k',
    'phylloquinone': 'vitamin_k',
    
    '칼슘': 'calcium',
    'calcium': 'calcium',
    'ca': 'calcium',
    
    '마그네슘': 'magnesium',
    'magnesium': 'magnesium',
    'mg': 'magnesium',
    
    '아연': 'zinc',
    'zinc': 'zinc',
    'zn': 'zinc',
    
    '철': 'iron',
    'iron': 'iron',
    'fe': 'iron',
    '철분': 'iron',
    
    '인': 'phosphorus',
    'phosphorus': 'phosphorus',
    
    '요오드': 'iodine',
    'iodine': 'iodine',
    '아이오딘': 'iodine',
    
    '셀레늄': 'selenium',
    'selenium': 'selenium',
    'se': 'selenium',
    
    '구리': 'copper',
    'copper': 'copper',
    'cu': 'copper',
    
    '망간': 'manganese',
    'manganese': 'manganese',
    'mn': 'manganese',
    
    '크롬': 'chromium',
    'chromium': 'chromium',
    'cr': 'chromium',
    
    '몰리브덴': 'molybdenum',
    'molybdenum': 'molybdenum',
    
    '칼륨': 'potassium',
    'potassium': 'potassium',
    'k': 'potassium',
    
    '오메가3': 'omega3',
    'omega3': 'omega3',
    'omega-3': 'omega3',
    'epa': 'omega3',
    'dha': 'omega3',
    
    '프로바이오틱스': 'probiotics',
    'probiotics': 'probiotics',
    '유산균': 'probiotics',
    
    '식이섬유': 'dietary_fiber',
    'dietaryfiber': 'dietary_fiber',
    'fiber': 'dietary_fiber',
    
    '단백질': 'protein',
    'protein': 'protein',
    
    '코엔자임q10': 'coq10',
    'coq10': 'coq10',
    'coenzymeq10': 'coq10',
    
    '홍삼': 'red_ginseng',
    'redginseng': 'red_ginseng',
    '인삼': 'red_ginseng',
    
    '루테인': 'lutein',
    'lutein': 'lutein',
    
    '밀크씨슬': 'milk_thistle',
    'milkthistle': 'milk_thistle',
    '엉겅퀴': 'milk_thistle',
    
    '글루코사민': 'glucosamine',
    'glucosamine': 'glucosamine',
    
    '콜라겐': 'collagen',
    'collagen': 'collagen',
  };
  
  return mappings[normalized] || null;
}

/**
 * 섭취량 범위 파싱 (예: "100~1000mg" → {min: 100, max: 1000, unit: "mg"})
 */
function parseDailyIntakeRange(rangeStr: string): { min: number; max: number; unit: string } {
  const match = rangeStr.match(/([\d.]+)~([\d.]+)\s*([a-zA-Zμ]+)/);
  if (match) {
    return {
      min: parseFloat(match[1]),
      max: parseFloat(match[2]),
      unit: match[3],
    };
  }
  return { min: 0, max: 0, unit: '' };
}

/**
 * 단위 표준화 및 변환
 */
function normalizeUnit(value: number, fromUnit: string, toUnit: string): number {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();
  
  if (from === to) return value;
  
  // mg <-> g
  if (from === 'mg' && to === 'g') return value / 1000;
  if (from === 'g' && to === 'mg') return value * 1000;
  
  // μg <-> mg
  if (from === 'μg' && to === 'mg') return value / 1000;
  if (from === 'mg' && to === 'μg') return value * 1000;
  
  // μg <-> g
  if (from === 'μg' && to === 'g') return value / 1000000;
  if (from === 'g' && to === 'μg') return value * 1000000;
  
  return value; // 변환 불가능한 경우 원래 값 반환
}

/**
 * 성분 상태 판단
 */
function determineIngredientStatus(
  amount: number,
  min: number,
  max: number
): 'deficient' | 'optimal' | 'excessive' | 'dangerous' {
  if (amount < min * 0.5) return 'deficient';
  if (amount < min) return 'deficient';
  if (amount <= max) return 'optimal';
  if (amount <= max * 1.5) return 'excessive';
  return 'dangerous';
}

/**
 * 약사 관점의 상세 분석 수행
 */
export function performPharmacistAnalysis(
  nutrients: Record<string, any>
): PharmacistAnalysisResult {
  const analyzedIngredients: IngredientAnalysis[] = [];
  const complianceIssues: ComplianceIssue[] = [];
  const drugInteractions: string[] = [];
  const contraindicatedFor: string[] = [];
  const appropriateFor: string[] = [];
  
  // 각 영양성분/기능성 원료 분석
  Object.entries(nutrients).forEach(([key, data]) => {
    const standardKey = normalizeIngredientName(key);
    if (!standardKey) return;
    
    const ingredient = FUNCTIONAL_INGREDIENTS[standardKey];
    if (!ingredient) return;
    
    const amount = typeof data === 'object' ? data.value : data;
    const unit = typeof data === 'object' ? data.unit : 'mg';
    
    const range = parseDailyIntakeRange(ingredient.dailyIntake);
    
    // 단위 통일
    const normalizedAmount = normalizeUnit(amount, unit, range.unit);
    
    // 상태 판단
    const status = determineIngredientStatus(normalizedAmount, range.min, range.max);
    
    // 준수율 계산
    const optimal = (range.min + range.max) / 2;
    const compliancePercentage = Math.min(100, (normalizedAmount / optimal) * 100);
    
    // 약사 노트 생성
    let pharmacistNote = '';
    if (status === 'deficient') {
      pharmacistNote = `권장량 미달. 최소 ${range.min}${range.unit} 이상 섭취 필요.`;
      complianceIssues.push({
        severity: 'warning',
        ingredient: ingredient.koreanName,
        issue: `${ingredient.koreanName} 함량이 식약처 권장 최소량(${range.min}${range.unit})에 미치지 못합니다.`,
        recommendation: `최소 ${range.min}${range.unit} 이상으로 증량을 권장합니다.`,
        kfdaReference: ingredient.dailyIntake,
      });
    } else if (status === 'optimal') {
      pharmacistNote = `식약처 기준 적정 범위 내. 안전한 섭취 가능.`;
    } else if (status === 'excessive') {
      pharmacistNote = `권장 상한선 초과. 장기 복용 시 주의 필요.`;
      complianceIssues.push({
        severity: 'warning',
        ingredient: ingredient.koreanName,
        issue: `${ingredient.koreanName} 함량이 식약처 권장 상한선(${range.max}${range.unit})을 초과합니다.`,
        recommendation: `${range.max}${range.unit} 이하로 감량하거나 복용 빈도 조절이 필요합니다.`,
        kfdaReference: ingredient.dailyIntake,
      });
    } else if (status === 'dangerous') {
      pharmacistNote = `위험 수준. 즉시 섭취 중단 및 전문가 상담 필요.`;
      complianceIssues.push({
        severity: 'critical',
        ingredient: ingredient.koreanName,
        issue: `${ingredient.koreanName} 함량이 안전 상한선을 크게 초과하여 건강 위해 가능성이 있습니다.`,
        recommendation: `즉시 섭취를 중단하고 의사 또는 약사와 상담하십시오.`,
        kfdaReference: ingredient.dailyIntake,
      });
    }
    
    analyzedIngredients.push({
      name: standardKey,
      koreanName: ingredient.koreanName,
      detectedAmount: normalizedAmount,
      unit: range.unit,
      dailyIntakeRange: ingredient.dailyIntake,
      status,
      compliancePercentage,
      kfdaApproval: ingredient.kfdaApproved,
      functionality: ingredient.functionality,
      precautions: ingredient.precautions,
      targetGroup: ingredient.targetGroup,
      pharmacistNote,
    });
    
    // 약물 상호작용 체크
    if (ingredient.precautions.some(p => p.includes('항응고제'))) {
      drugInteractions.push(`${ingredient.koreanName}: 와파린 등 항응고제와 상호작용 가능`);
    }
    if (ingredient.precautions.some(p => p.includes('당뇨'))) {
      drugInteractions.push(`${ingredient.koreanName}: 당뇨약과 상호작용 가능 - 혈당 모니터링 필요`);
    }
    if (ingredient.precautions.some(p => p.includes('고혈압'))) {
      drugInteractions.push(`${ingredient.koreanName}: 혈압약과 상호작용 가능`);
    }
    
    // 금기 대상 체크
    if (ingredient.precautions.some(p => p.includes('임산부'))) {
      contraindicatedFor.push(`임산부(${ingredient.koreanName})`);
    }
    if (ingredient.precautions.some(p => p.includes('신장'))) {
      contraindicatedFor.push(`신장질환자(${ingredient.koreanName})`);
    }
    if (ingredient.precautions.some(p => p.includes('간'))) {
      contraindicatedFor.push(`간질환자(${ingredient.koreanName})`);
    }
    
    // 적합 대상 추가
    appropriateFor.push(...ingredient.targetGroup.map(t => `${t}(${ingredient.koreanName})`));
  });
  
  // 전체 준수율 계산
  const avgCompliance = analyzedIngredients.length > 0
    ? analyzedIngredients.reduce((sum, ing) => sum + ing.compliancePercentage, 0) / analyzedIngredients.length
    : 0;
  
  // 전체 등급 판정
  let overallRating: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  const hasDangerous = analyzedIngredients.some(ing => ing.status === 'dangerous');
  const hasCriticalIssues = complianceIssues.some(issue => issue.severity === 'critical');
  
  if (hasDangerous || hasCriticalIssues) {
    overallRating = 'dangerous';
  } else if (avgCompliance >= 90 && complianceIssues.length === 0) {
    overallRating = 'excellent';
  } else if (avgCompliance >= 75 && complianceIssues.filter(i => i.severity === 'warning').length <= 2) {
    overallRating = 'good';
  } else if (avgCompliance >= 60) {
    overallRating = 'acceptable';
  } else {
    overallRating = 'poor';
  }
  
  // 복용 가이드라인
  const dosageGuidance = generateDosageGuidance(analyzedIngredients, complianceIssues);
  
  // 전문가 권고사항
  const professionalRecommendation = generateProfessionalRecommendation(
    overallRating,
    analyzedIngredients,
    complianceIssues,
    drugInteractions
  );
  
  // 규제 상태
  const kfdaCompliant = complianceIssues.filter(i => i.severity === 'critical').length === 0;
  const healthFunctionalFood = analyzedIngredients.every(ing => ing.kfdaApproval);
  
  return {
    overallRating,
    complianceScore: Math.round(avgCompliance),
    analyzedIngredients,
    complianceIssues,
    drugInteractions: [...new Set(drugInteractions)],
    contraindicatedFor: [...new Set(contraindicatedFor)],
    appropriateFor: [...new Set(appropriateFor)],
    dosageGuidance,
    professionalRecommendation,
    regulatoryStatus: {
      kfdaCompliant,
      healthFunctionalFood,
      requiresPrescription: false,
      ageRestrictions: [],
    },
  };
}

function generateDosageGuidance(
  ingredients: IngredientAnalysis[],
  issues: ComplianceIssue[]
): string {
  let guidance = '【복용 가이드라인】\n\n';
  
  if (issues.length === 0) {
    guidance += '✓ 모든 성분이 식약처 권장 범위 내에 있습니다.\n';
    guidance += '✓ 제품 라벨에 표시된 용법·용량대로 복용하십시오.\n';
    guidance += '✓ 1일 권장량을 초과하지 마십시오.\n';
  } else {
    guidance += '⚠ 다음 사항을 주의하여 복용하십시오:\n\n';
    issues.forEach(issue => {
      if (issue.severity === 'critical') {
        guidance += `🚫 ${issue.ingredient}: ${issue.recommendation}\n`;
      } else if (issue.severity === 'warning') {
        guidance += `⚠ ${issue.ingredient}: ${issue.recommendation}\n`;
      }
    });
  }
  
  guidance += '\n【일반 주의사항】\n';
  guidance += '• 식사와 함께 또는 식후에 복용하는 것이 좋습니다.\n';
  guidance += '• 충분한 물과 함께 섭취하십시오.\n';
  guidance += '• 다른 건강기능식품과 중복 섭취 시 총 섭취량을 확인하십시오.\n';
  guidance += '• 이상 반응 발생 시 즉시 복용을 중단하고 전문가와 상담하십시오.\n';
  
  return guidance;
}

function generateProfessionalRecommendation(
  rating: string,
  ingredients: IngredientAnalysis[],
  issues: ComplianceIssue[],
  interactions: string[]
): string {
  let recommendation = '【약사 전문 의견】\n\n';
  
  // 전체 평가
  switch (rating) {
    case 'excellent':
      recommendation += '✅ 우수: 이 제품은 식약처 기준을 완벽하게 준수하고 있으며, 안전하게 섭취 가능합니다.\n\n';
      break;
    case 'good':
      recommendation += '✅ 양호: 이 제품은 대체로 식약처 기준에 부합하나, 일부 개선이 필요한 부분이 있습니다.\n\n';
      break;
    case 'acceptable':
      recommendation += '⚠ 주의: 이 제품은 여러 성분에서 기준치 이탈이 있어 주의가 필요합니다.\n\n';
      break;
    case 'poor':
      recommendation += '⚠ 미흡: 이 제품은 식약처 기준 대비 미흡한 점이 많아 재검토가 필요합니다.\n\n';
      break;
    case 'dangerous':
      recommendation += '🚫 위험: 이 제품은 안전성에 심각한 문제가 있어 섭취를 권장하지 않습니다.\n\n';
      break;
  }
  
  // 주요 성분 평가
  recommendation += '【주요 성분 분석】\n';
  const optimalIngredients = ingredients.filter(ing => ing.status === 'optimal');
  const problematicIngredients = ingredients.filter(ing => ing.status !== 'optimal');
  
  if (optimalIngredients.length > 0) {
    recommendation += `✓ 적정 범위 성분 (${optimalIngredients.length}개): `;
    recommendation += optimalIngredients.map(ing => ing.koreanName).join(', ') + '\n';
  }
  
  if (problematicIngredients.length > 0) {
    recommendation += `⚠ 주의 필요 성분 (${problematicIngredients.length}개): `;
    recommendation += problematicIngredients.map(ing => ing.koreanName).join(', ') + '\n';
  }
  
  recommendation += '\n';
  
  // 약물 상호작용
  if (interactions.length > 0) {
    recommendation += '【약물 상호작용 주의】\n';
    interactions.forEach(interaction => {
      recommendation += `• ${interaction}\n`;
    });
    recommendation += '\n';
  }
  
  // 최종 권고
  recommendation += '【최종 권고사항】\n';
  if (rating === 'excellent' || rating === 'good') {
    recommendation += '• 현재 복용 중인 약이 있다면 약사 또는 의사와 상담 후 섭취하십시오.\n';
    recommendation += '• 개인의 건강 상태와 필요에 따라 적합성이 다를 수 있습니다.\n';
    recommendation += '• 정기적인 건강검진을 통해 영양 상태를 확인하십시오.\n';
  } else {
    recommendation += '• 제품 섭취 전 반드시 약사 또는 의사와 상담하십시오.\n';
    recommendation += '• 기존 질환이나 복용 중인 약물이 있다면 특히 주의가 필요합니다.\n';
    recommendation += '• 더 안전하고 균형잡힌 제품을 선택하는 것을 권장합니다.\n';
  }
  
  return recommendation;
}
