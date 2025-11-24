/**
 * 건강기능식품 기능성 원료 데이터베이스
 * 식약처 고시 건강기능식품 기능성 원료 기준
 */

export interface FunctionalIngredient {
  koreanName: string;
  englishName: string;
  category: string;
  functionality: string[];
  dailyIntake: string;
  precautions: string[];
  targetGroup: string[];
  kfdaApproved: boolean;
}

/**
 * 식약처 인정 건강기능식품 기능성 원료
 */
export const FUNCTIONAL_INGREDIENTS: Record<string, FunctionalIngredient> = {
  // 비타민류
  vitamin_a: {
    koreanName: '비타민A',
    englishName: 'Vitamin A',
    category: '비타민',
    functionality: ['어두운 곳에서 시각 적응을 위해 필요', '피부와 점막을 형성하고 기능을 유지하는데 필요', '상피세포의 성장과 발달에 필요'],
    dailyIntake: '210~850μg RE',
    precautions: ['과다섭취 시 두통, 구토 발생 가능', '임산부 주의'],
    targetGroup: ['시력 개선 필요자', '피부 건강 관심자'],
    kfdaApproved: true,
  },
  vitamin_b1: {
    koreanName: '비타민B1(티아민)',
    englishName: 'Vitamin B1 (Thiamin)',
    category: '비타민',
    functionality: ['탄수화물과 에너지 대사에 필요'],
    dailyIntake: '0.36~100mg',
    precautions: ['과다섭취 시 드물게 알레르기 반응'],
    targetGroup: ['피로 개선', '신경계 건강'],
    kfdaApproved: true,
  },
  vitamin_b2: {
    koreanName: '비타민B2(리보플라빈)',
    englishName: 'Vitamin B2 (Riboflavin)',
    category: '비타민',
    functionality: ['체내 에너지 생성에 필요'],
    dailyIntake: '0.42~40mg',
    precautions: ['고용량 섭취 시 소변이 노란색으로 변할 수 있음 (무해)'],
    targetGroup: ['에너지 대사', '피부 건강'],
    kfdaApproved: true,
  },
  vitamin_b3: {
    koreanName: '비타민B3(나이아신)',
    englishName: 'Vitamin B3 (Niacin)',
    category: '비타민',
    functionality: ['체내 에너지 생성에 필요'],
    dailyIntake: '4.5~1000mg NE',
    precautions: ['고용량 섭취 시 피부 홍조 가능'],
    targetGroup: ['에너지 대사', '콜레스테롤 관리'],
    kfdaApproved: true,
  },
  vitamin_b5: {
    koreanName: '비타민B5(판토텐산)',
    englishName: 'Vitamin B5 (Pantothenic Acid)',
    category: '비타민',
    functionality: ['지방, 탄수화물, 단백질 대사와 에너지 생성에 필요'],
    dailyIntake: '1.5~200mg',
    precautions: ['일반적으로 안전'],
    targetGroup: ['에너지 대사', '부신 기능'],
    kfdaApproved: true,
  },
  vitamin_b6: {
    koreanName: '비타민B6',
    englishName: 'Vitamin B6',
    category: '비타민',
    functionality: ['단백질 및 아미노산 이용에 필요', '혈액의 호모시스테인 수준을 정상으로 유지하는데 필요'],
    dailyIntake: '0.45~67mg',
    precautions: ['장기간 고용량 섭취 시 신경병증 가능'],
    targetGroup: ['단백질 대사', '신경계 건강'],
    kfdaApproved: true,
  },
  vitamin_b7: {
    koreanName: '비타민B7(비오틴)',
    englishName: 'Vitamin B7 (Biotin)',
    category: '비타민',
    functionality: ['지방, 탄수화물, 단백질 대사와 에너지 생성에 필요'],
    dailyIntake: '9~900μg',
    precautions: ['일반적으로 안전'],
    targetGroup: ['모발 건강', '피부 건강'],
    kfdaApproved: true,
  },
  vitamin_b9: {
    koreanName: '비타민B9(엽산)',
    englishName: 'Vitamin B9 (Folic Acid)',
    category: '비타민',
    functionality: ['세포와 혈액생성에 필요', '태아 신경관의 정상 발달에 필요', '혈액의 호모시스테인 수준을 정상으로 유지하는데 필요'],
    dailyIntake: '120~400μg',
    precautions: ['비타민B12 결핍 가릴 수 있음', '항경련제 복용자 주의'],
    targetGroup: ['임산부', '가임기 여성', '빈혈 예방'],
    kfdaApproved: true,
  },
  vitamin_b12: {
    koreanName: '비타민B12',
    englishName: 'Vitamin B12',
    category: '비타민',
    functionality: ['정상적인 엽산 대사에 필요'],
    dailyIntake: '0.72~1000μg',
    precautions: ['채식주의자 결핍 주의'],
    targetGroup: ['빈혈 예방', '신경계 건강', '채식주의자'],
    kfdaApproved: true,
  },
  vitamin_c: {
    koreanName: '비타민C',
    englishName: 'Vitamin C',
    category: '비타민',
    functionality: ['결합조직 형성과 기능유지에 필요', '철의 흡수에 필요', '항산화 작용을 하여 유해산소로부터 세포를 보호하는데 필요'],
    dailyIntake: '100~1000mg',
    precautions: ['과다섭취 시 설사, 복통 가능'],
    targetGroup: ['면역력 개선', '피로 개선', '항산화'],
    kfdaApproved: true,
  },
  vitamin_d: {
    koreanName: '비타민D',
    englishName: 'Vitamin D',
    category: '비타민',
    functionality: ['칼슘과 인이 흡수되고 이용되는데 필요', '뼈의 형성과 유지에 필요', '골다공증 발생 위험 감소에 도움을 줌'],
    dailyIntake: '10~100μg',
    precautions: ['과다섭취 시 고칼슘혈증 가능'],
    targetGroup: ['뼈 건강', '어린이/노인', '실내 생활자'],
    kfdaApproved: true,
  },
  vitamin_e: {
    koreanName: '비타민E',
    englishName: 'Vitamin E',
    category: '비타민',
    functionality: ['항산화 작용을 하여 유해산소로부터 세포를 보호하는데 필요'],
    dailyIntake: '11~400mg α-TE',
    precautions: ['항응고제 복용자 주의'],
    targetGroup: ['항산화', '심혈관 건강'],
    kfdaApproved: true,
  },
  vitamin_k: {
    koreanName: '비타민K',
    englishName: 'Vitamin K',
    category: '비타민',
    functionality: ['정상적인 혈액응고에 필요', '뼈의 구성에 필요'],
    dailyIntake: '21~1000μg',
    precautions: ['항응고제(와파린) 복용자 금지'],
    targetGroup: ['혈액 응고', '뼈 건강'],
    kfdaApproved: true,
  },

  // 미네랄류
  calcium: {
    koreanName: '칼슘',
    englishName: 'Calcium',
    category: '미네랄',
    functionality: ['뼈와 치아 형성에 필요', '신경과 근육 기능 유지에 필요', '정상적인 혈액응고에 필요', '골다공증 발생 위험 감소에 도움을 줌'],
    dailyIntake: '210~800mg',
    precautions: ['과다섭취 시 변비, 신장결석 위험', '고칼슘혈증 주의'],
    targetGroup: ['성장기 어린이', '폐경기 여성', '노인'],
    kfdaApproved: true,
  },
  magnesium: {
    koreanName: '마그네슘',
    englishName: 'Magnesium',
    category: '미네랄',
    functionality: ['에너지 이용에 필요', '신경과 근육 기능 유지에 필요'],
    dailyIntake: '94.5~350mg',
    precautions: ['신장질환자 주의', '설사 유발 가능'],
    targetGroup: ['피로 개선', '근육 경련 예방'],
    kfdaApproved: true,
  },
  zinc: {
    koreanName: '아연',
    englishName: 'Zinc',
    category: '미네랄',
    functionality: ['정상적인 면역기능에 필요', '정상적인 세포분열에 필요'],
    dailyIntake: '2.55~35mg',
    precautions: ['과다섭취 시 구리 결핍 유발', '구역질 가능'],
    targetGroup: ['면역력 개선', '성장기', '임산부'],
    kfdaApproved: true,
  },
  iron: {
    koreanName: '철',
    englishName: 'Iron',
    category: '미네랄',
    functionality: ['체내 산소운반과 혈액생성에 필요', '에너지 생성에 필요'],
    dailyIntake: '3.6~45mg',
    precautions: ['과다섭취 시 변비, 복통', '위장장애 가능'],
    targetGroup: ['빈혈 예방', '여성', '성장기'],
    kfdaApproved: true,
  },
  phosphorus: {
    koreanName: '인',
    englishName: 'Phosphorus',
    category: '미네랄',
    functionality: ['뼈와 치아 형성에 필요', '에너지 생성에 필요'],
    dailyIntake: '210~3500mg',
    precautions: ['과다섭취 시 칼슘 흡수 저해'],
    targetGroup: ['뼈 건강', '에너지 대사'],
    kfdaApproved: true,
  },
  iodine: {
    koreanName: '요오드',
    englishName: 'Iodine',
    category: '미네랄',
    functionality: ['갑상선 호르몬의 합성에 필요', '에너지 생성에 필요', '신경발달에 필요'],
    dailyIntake: '45~2400μg',
    precautions: ['갑상선 질환자 주의', '과다섭취 시 갑상선 기능 이상'],
    targetGroup: ['갑상선 건강', '임산부', '성장기'],
    kfdaApproved: true,
  },
  selenium: {
    koreanName: '셀레늄',
    englishName: 'Selenium',
    category: '미네랄',
    functionality: ['유해산소로부터 세포를 보호하는데 필요'],
    dailyIntake: '16.5~200μg',
    precautions: ['과다섭취 시 탈모, 손톱 변형'],
    targetGroup: ['항산화', '면역력', '갑상선 건강'],
    kfdaApproved: true,
  },
  copper: {
    koreanName: '구리',
    englishName: 'Copper',
    category: '미네랄',
    functionality: ['철의 운반과 이용에 필요', '유해산소로부터 세포를 보호하는데 필요'],
    dailyIntake: '0.24~8mg',
    precautions: ['과다섭취 시 간 손상 가능'],
    targetGroup: ['빈혈 예방', '뼈 건강'],
    kfdaApproved: true,
  },
  manganese: {
    koreanName: '망간',
    englishName: 'Manganese',
    category: '미네랄',
    functionality: ['뼈 형성에 필요', '에너지 이용에 필요', '유해산소로부터 세포를 보호하는데 필요'],
    dailyIntake: '0.9~10mg',
    precautions: ['과다섭취 시 신경계 손상 가능'],
    targetGroup: ['뼈 건강', '항산화'],
    kfdaApproved: true,
  },
  chromium: {
    koreanName: '크롬',
    englishName: 'Chromium',
    category: '미네랄',
    functionality: ['체내 탄수화물, 지방, 단백질 대사에 관여'],
    dailyIntake: '15~500μg',
    precautions: ['당뇨약 복용자 상호작용 주의'],
    targetGroup: ['혈당 관리', '당뇨 예방'],
    kfdaApproved: true,
  },
  molybdenum: {
    koreanName: '몰리브덴',
    englishName: 'Molybdenum',
    category: '미네랄',
    functionality: ['산화·환원 효소의 활성에 필요'],
    dailyIntake: '7.5~500μg',
    precautions: ['과다섭취 시 통풍 악화 가능'],
    targetGroup: ['효소 활성'],
    kfdaApproved: true,
  },
  potassium: {
    koreanName: '칼륨',
    englishName: 'Potassium',
    category: '미네랄',
    functionality: ['체내 물과 전해질 균형 유지', '혈압 조절에 도움'],
    dailyIntake: '1050~3500mg',
    precautions: ['신장질환자 주의', '고칼륨혈증 위험'],
    targetGroup: ['혈압 관리', '심혈관 건강'],
    kfdaApproved: true,
  },

  // 기능성 지방산
  omega3: {
    koreanName: '오메가-3 지방산',
    englishName: 'Omega-3 Fatty Acids',
    category: '기능성 지방산',
    functionality: ['혈중 중성지질 개선에 도움을 줄 수 있음', '혈행 개선에 도움을 줄 수 있음', '기억력 개선에 도움을 줄 수 있음', '건조한 눈을 개선하여 눈 건강에 도움을 줄 수 있음'],
    dailyIntake: 'EPA 및 DHA의 합 500~2000mg',
    precautions: ['항응고제 복용자 주의', '출혈성 질환자 주의'],
    targetGroup: ['심혈관 건강', '뇌 건강', '안구 건조증'],
    kfdaApproved: true,
  },

  // 프로바이오틱스
  probiotics: {
    koreanName: '프로바이오틱스',
    englishName: 'Probiotics',
    category: '프로바이오틱스',
    functionality: ['유산균 증식 및 유해균 억제·배변활동 원활에 도움을 줌', '장 건강에 도움을 줄 수 있음'],
    dailyIntake: '1억~100억 CFU',
    precautions: ['면역저하자 주의'],
    targetGroup: ['장 건강', '소화 개선', '면역력'],
    kfdaApproved: true,
  },

  // 식이섬유
  dietary_fiber: {
    koreanName: '식이섬유',
    englishName: 'Dietary Fiber',
    category: '식이섬유',
    functionality: ['배변활동 원활에 도움을 줌', '혈중 콜레스테롤 개선에 도움을 줄 수 있음', '식후 혈당상승 억제에 도움을 줄 수 있음'],
    dailyIntake: '12~30g',
    precautions: ['과다섭취 시 복부팽만, 설사'],
    targetGroup: ['변비 개선', '혈당 관리', '콜레스테롤 관리'],
    kfdaApproved: true,
  },

  // 단백질/아미노산
  protein: {
    koreanName: '단백질',
    englishName: 'Protein',
    category: '단백질/아미노산',
    functionality: ['근육·결합조직 등 신체조직의 구성성분', '효소·호르몬·항체의 구성에 필요', '체내 필수 영양성분이나 활성물질의 운반과 저장에 필요', '체액·산-염기의 균형유지에 필요', '에너지·포도당·지질의 합성에 필요'],
    dailyIntake: '24~80g',
    precautions: ['신장질환자 주의'],
    targetGroup: ['근육 성장', '운동선수', '노인'],
    kfdaApproved: true,
  },

  // 코엔자임Q10
  coq10: {
    koreanName: '코엔자임Q10',
    englishName: 'Coenzyme Q10',
    category: '항산화제',
    functionality: ['항산화 작용을 하여 유해산소로부터 세포를 보호하는데 필요', '높은 혈압 감소에 도움을 줄 수 있음'],
    dailyIntake: '90~100mg',
    precautions: ['항응고제 복용자 주의'],
    targetGroup: ['항산화', '혈압 관리', '심장 건강'],
    kfdaApproved: true,
  },

  // 홍삼
  red_ginseng: {
    koreanName: '홍삼',
    englishName: 'Red Ginseng',
    category: '전통 한약재',
    functionality: ['면역력 증진에 도움을 줄 수 있음', '피로개선에 도움을 줄 수 있음', '혈소판 응집억제를 통한 혈액흐름에 도움을 줄 수 있음', '기억력 개선에 도움을 줄 수 있음', '항산화에 도움을 줄 수 있음'],
    dailyIntake: '진세노사이드 Rg1+Rb1+Rg3 2.4~80mg',
    precautions: ['고혈압 환자 주의', '당뇨병 환자 주의'],
    targetGroup: ['면역력', '피로 개선', '중년층'],
    kfdaApproved: true,
  },

  // 루테인
  lutein: {
    koreanName: '루테인',
    englishName: 'Lutein',
    category: '카로티노이드',
    functionality: ['노화로 인해 감소될 수 있는 황반색소밀도를 유지하여 눈 건강에 도움을 줌'],
    dailyIntake: '10~20mg',
    precautions: ['과다섭취 시 피부색 변화 가능'],
    targetGroup: ['눈 건강', '장시간 스크린 사용자', '노인'],
    kfdaApproved: true,
  },

  // 밀크씨슬(엉겅퀴)
  milk_thistle: {
    koreanName: '밀크씨슬추출물',
    englishName: 'Milk Thistle Extract',
    category: '식물성 추출물',
    functionality: ['간 건강에 도움을 줄 수 있음'],
    dailyIntake: '실리마린 130mg',
    precautions: ['간질환 치료 중인 경우 전문가 상담'],
    targetGroup: ['간 건강', '음주자', '중년층'],
    kfdaApproved: true,
  },

  // 글루코사민
  glucosamine: {
    koreanName: '글루코사민',
    englishName: 'Glucosamine',
    category: '관절 건강',
    functionality: ['관절 및 연골 건강에 도움을 줄 수 있음'],
    dailyIntake: '1500mg',
    precautions: ['갑각류 알레르기 주의', '당뇨환자 주의'],
    targetGroup: ['관절 건강', '노인', '운동선수'],
    kfdaApproved: true,
  },

  // 콜라겐
  collagen: {
    koreanName: '콜라겐',
    englishName: 'Collagen',
    category: '단백질',
    functionality: ['피부 보습에 도움을 줄 수 있음', '자외선에 의한 피부 손상으로부터 피부건강 유지에 도움을 줄 수 있음'],
    dailyIntake: '2~10g',
    precautions: ['단백질 알레르기 주의'],
    targetGroup: ['피부 건강', '관절 건강', '중년 여성'],
    kfdaApproved: true,
  },
};

/**
 * 건강기능식품 분류 카테고리
 */
export const FUNCTIONAL_FOOD_CATEGORIES = {
  immune: {
    name: '면역기능 개선',
    keywords: ['면역', '항체', '저항력', '비타민C', '아연', '홍삼', '프로바이오틱스'],
  },
  fatigue: {
    name: '피로개선',
    keywords: ['피로', '에너지', '활력', '비타민B', '홍삼', '코엔자임Q10'],
  },
  eye: {
    name: '눈 건강',
    keywords: ['시력', '눈', '루테인', '비타민A', '안토시아닌', '오메가3'],
  },
  bone: {
    name: '뼈 건강',
    keywords: ['뼈', '골다공증', '칼슘', '비타민D', '비타민K'],
  },
  joint: {
    name: '관절 건강',
    keywords: ['관절', '연골', '글루코사민', '콜라겐', 'MSM'],
  },
  cardiovascular: {
    name: '심혈관 건강',
    keywords: ['혈압', '혈행', '콜레스테롤', '오메가3', '코엔자임Q10'],
  },
  digestive: {
    name: '장 건강',
    keywords: ['장', '소화', '배변', '프로바이오틱스', '식이섬유'],
  },
  liver: {
    name: '간 건강',
    keywords: ['간', '해독', '밀크씨슬', '헛개나무'],
  },
  skin: {
    name: '피부 건강',
    keywords: ['피부', '보습', '콜라겐', '비타민C', '비타민E'],
  },
  brain: {
    name: '기억력/인지력',
    keywords: ['기억력', '인지', '뇌', '오메가3', '은행잎', '홍삼'],
  },
  antioxidant: {
    name: '항산화',
    keywords: ['항산화', '노화', '비타민C', '비타민E', '셀레늄', '코엔자임Q10'],
  },
  blood_sugar: {
    name: '혈당 관리',
    keywords: ['혈당', '당뇨', '식이섬유', '바나바잎', '크롬'],
  },
};

/**
 * 영양성분으로부터 건강기능식품 분류 추정
 */
export function classifyFunctionalFood(nutrients: Record<string, any>): {
  primaryCategory: string;
  secondaryCategories: string[];
  detectedIngredients: string[];
  functionality: string[];
} {
  const detectedIngredients: string[] = [];
  const functionality: string[] = [];
  const categoryScores: Record<string, number> = {};

  // 영양성분 기반 추정
  if (nutrients.vitamin_c?.value > 100) {
    detectedIngredients.push('비타민C');
    functionality.push(...FUNCTIONAL_INGREDIENTS.vitamin_c.functionality);
    categoryScores.immune = (categoryScores.immune || 0) + 3;
    categoryScores.antioxidant = (categoryScores.antioxidant || 0) + 2;
  }

  if (nutrients.protein?.value > 20) {
    detectedIngredients.push('단백질');
    functionality.push(...FUNCTIONAL_INGREDIENTS.protein.functionality);
  }

  if (nutrients.calcium?.value > 200) {
    detectedIngredients.push('칼슘');
    functionality.push(...FUNCTIONAL_INGREDIENTS.calcium.functionality);
    categoryScores.bone = (categoryScores.bone || 0) + 3;
  }

  if (nutrients.fiber?.value > 5) {
    detectedIngredients.push('식이섬유');
    functionality.push(...FUNCTIONAL_INGREDIENTS.dietary_fiber.functionality);
    categoryScores.digestive = (categoryScores.digestive || 0) + 3;
  }

  // 카테고리 점수 기반 분류
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat);

  const primaryCategory = sortedCategories[0] || 'general';
  const secondaryCategories = sortedCategories.slice(1, 3);

  return {
    primaryCategory,
    secondaryCategories,
    detectedIngredients,
    functionality: [...new Set(functionality)], // 중복 제거
  };
}
