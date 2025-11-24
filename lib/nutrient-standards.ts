/**
 * 식약처 및 영양학 기준 데이터
 * Korean KFDA standards and nutritional evaluation criteria
 */

export interface NutrientStandard {
  koreanName: string;
  dailyValue: number;
  unit: string;
  kfdaGuideline: string;
  nutritionalInfo: string;
  lowThreshold?: number;
  highThreshold?: number;
  excessRisk?: string;
  deficiencyRisk?: string;
}

/**
 * 영양소별 식약처 기준 및 영양학적 정보
 */
export const NUTRIENT_STANDARDS: Record<string, NutrientStandard> = {
  energy: {
    koreanName: '열량',
    dailyValue: 2000,
    unit: 'kcal',
    kfdaGuideline: '성인 1일 영양소 기준치 2,000kcal 기준',
    nutritionalInfo: '신체 활동과 기초대사에 필요한 에너지원. 활동량에 따라 개인별 필요량이 다릅니다.',
    lowThreshold: 100,
    highThreshold: 400,
    excessRisk: '과다 섭취 시 체중 증가 및 비만 위험',
    deficiencyRisk: '부족 시 피로감, 무기력증 발생 가능',
  },
  protein: {
    koreanName: '단백질',
    dailyValue: 50,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 50g (체중 kg당 0.8~1.0g 권장)',
    nutritionalInfo: '근육, 효소, 호르몬 생성에 필수적. 면역력 강화 및 조직 재생에 중요한 역할을 합니다.',
    lowThreshold: 5,
    highThreshold: 20,
    excessRisk: '과다 섭취 시 신장 부담 증가 가능',
    deficiencyRisk: '부족 시 근육량 감소, 면역력 저하',
  },
  fat_total: {
    koreanName: '지방',
    dailyValue: 54,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 54g (총 열량의 15~30% 권장)',
    nutritionalInfo: '필수지방산 공급, 지용성 비타민 흡수, 세포막 구성에 필요합니다.',
    lowThreshold: 3,
    highThreshold: 15,
    excessRisk: '과다 섭취 시 비만, 심혈관질환 위험 증가',
    deficiencyRisk: '부족 시 필수지방산 결핍, 비타민 흡수 저해',
  },
  fat_saturated: {
    koreanName: '포화지방',
    dailyValue: 15,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 15g (총 열량의 7% 이하 권장)',
    nutritionalInfo: '동물성 지방에 많이 함유. 과다 섭취 시 LDL 콜레스테롤 증가.',
    highThreshold: 5,
    excessRisk: '과다 섭취 시 심혈관질환, 고지혈증 위험',
  },
  fat_trans: {
    koreanName: '트랜스지방',
    dailyValue: 2,
    unit: 'g',
    kfdaGuideline: '가능한 한 섭취하지 않는 것이 좋음 (WHO 권장: 총 열량의 1% 미만)',
    nutritionalInfo: '인공적으로 생성된 불포화지방. 심혈관 건강에 매우 해로운 지방입니다.',
    highThreshold: 0.5,
    excessRisk: '심혈관질환, 당뇨병 위험 크게 증가',
  },
  carbohydrate: {
    koreanName: '탄수화물',
    dailyValue: 324,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 324g (총 열량의 55~65% 권장)',
    nutritionalInfo: '주요 에너지원. 뇌와 신경계 활동에 필수적인 포도당을 공급합니다.',
    lowThreshold: 10,
    highThreshold: 50,
    excessRisk: '과다 섭취 시 체중 증가, 혈당 조절 문제',
    deficiencyRisk: '부족 시 저혈당, 집중력 저하',
  },
  sugar: {
    koreanName: '당류',
    dailyValue: 100,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 100g (총 열량의 10~20% 이내 권장)',
    nutritionalInfo: '단순당으로 빠른 에너지 공급. 과다 섭취 주의가 필요합니다.',
    highThreshold: 10,
    excessRisk: '과다 섭취 시 비만, 당뇨병, 충치 위험 증가',
  },
  sodium: {
    koreanName: '나트륨',
    dailyValue: 2000,
    unit: 'mg',
    kfdaGuideline: '성인 1일 영양소 기준치 2,000mg (WHO 권장: 2,000mg 이하)',
    nutritionalInfo: '체액 균형, 신경 전달에 필수. 하지만 과다 섭취가 흔합니다.',
    lowThreshold: 120,
    highThreshold: 400,
    excessRisk: '과다 섭취 시 고혈압, 심혈관질환, 신장 질환 위험',
    deficiencyRisk: '부족 시 근육 경련, 탈수 증상',
  },
  cholesterol: {
    koreanName: '콜레스테롤',
    dailyValue: 300,
    unit: 'mg',
    kfdaGuideline: '성인 1일 300mg 이하 섭취 권장',
    nutritionalInfo: '세포막 구성, 호르몬 합성에 필요하나 과다 섭취 주의.',
    highThreshold: 100,
    excessRisk: '과다 섭취 시 동맥경화, 심혈관질환 위험',
  },
  fiber: {
    koreanName: '식이섬유',
    dailyValue: 25,
    unit: 'g',
    kfdaGuideline: '성인 1일 영양소 기준치 25g (충분섭취량)',
    nutritionalInfo: '장 건강 개선, 혈당 조절, 포만감 증가에 도움을 줍니다.',
    lowThreshold: 2,
    highThreshold: 5,
    deficiencyRisk: '부족 시 변비, 대장 건강 악화',
  },
};

/**
 * 영양소 평가 함수
 */
export function evaluateNutrient(
  nutrientKey: string,
  value: number,
  unit: string
): {
  level: 'low' | 'moderate' | 'high' | 'very_high';
  evaluation: string;
  kfdaStatus: string;
} {
  const standard = NUTRIENT_STANDARDS[nutrientKey];
  if (!standard) {
    return {
      level: 'moderate',
      evaluation: '기준 정보 없음',
      kfdaStatus: '평가 불가',
    };
  }

  // 단위 변환 (필요시)
  let normalizedValue = value;
  if (unit === 'mg' && standard.unit === 'g') {
    normalizedValue = value / 1000;
  } else if (unit === 'g' && standard.unit === 'mg') {
    normalizedValue = value * 1000;
  }

  const percentage = (normalizedValue / standard.dailyValue) * 100;

  let level: 'low' | 'moderate' | 'high' | 'very_high';
  let evaluation: string;
  let kfdaStatus: string;

  // 영양소별 특성에 따른 평가
  const isUndesirable = ['sodium', 'sugar', 'fat_saturated', 'fat_trans', 'cholesterol'].includes(nutrientKey);

  if (isUndesirable) {
    // 낮을수록 좋은 영양소 (나트륨, 당류 등)
    if (percentage < 5) {
      level = 'low';
      evaluation = '매우 낮은 함량 (건강에 유리)';
      kfdaStatus = '저함량 식품';
    } else if (percentage < 15) {
      level = 'moderate';
      evaluation = '적정 함량';
      kfdaStatus = '적정 수준';
    } else if (percentage < 30) {
      level = 'high';
      evaluation = '다소 높은 함량 (섭취 주의)';
      kfdaStatus = '주의 필요';
    } else {
      level = 'very_high';
      evaluation = '매우 높은 함량 (과다 섭취 위험)';
      kfdaStatus = '고함량 - 섭취 제한 권장';
    }
  } else {
    // 높을수록 좋은 영양소 (단백질, 식이섬유 등)
    if (percentage < 5) {
      level = 'low';
      evaluation = '낮은 함량';
      kfdaStatus = '영양소 부족';
    } else if (percentage < 15) {
      level = 'moderate';
      evaluation = '적정 함량';
      kfdaStatus = '적정 수준';
    } else if (percentage < 30) {
      level = 'high';
      evaluation = '높은 함량 (영양가 우수)';
      kfdaStatus = '우수 식품';
    } else {
      level = 'very_high';
      evaluation = '매우 높은 함량';
      kfdaStatus = '고함량 식품';
    }
  }

  return { level, evaluation, kfdaStatus };
}

/**
 * 영양소 한글명 가져오기
 */
export function getNutrientKoreanName(key: string): string {
  return NUTRIENT_STANDARDS[key]?.koreanName || key;
}
