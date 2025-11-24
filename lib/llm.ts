import { GoogleGenerativeAI } from '@google/generative-ai';
import { AISummary } from './validate';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate comprehensive AI analysis using Google Gemini
 * Based on Korean KFDA (식약처) standards and functional food regulations
 */
export async function generateSummary(nutritionData: any): Promise<AISummary> {
  const { serving_size, nutrients, dv, productName, productForm } = nutritionData;
  
  // 영양성분 정보를 상세하게 포맷팅
  const nutrientDetails = Object.entries(nutrients)
    .map(([key, data]: [string, any]) => {
      const dvInfo = dv && dv[key] ? ` (영양소기준치 ${dv[key]}%)` : '';
      return `- ${getNutrientKoreanName(key)}: ${data.value}${data.unit}${dvInfo}`;
    })
    .join('\n');

  // 제형 정보 한글 변환
  const formNames: Record<string, string> = {
    tablet: '정제',
    capsule: '캡슐',
    powder: '분말',
    liquid: '액상',
    jelly: '젤리/연질캡슐',
    granule: '과립',
    stick: '스틱',
    other: '기타',
  };
  const formKorean = productForm ? formNames[productForm] || productForm : '미지정';

  const prompt = `당신은 대한민국 식품의약품안전처(KFDA) 인증 건강기능식품 전문 **약사**입니다.

# 분석 대상 제품 정보
${productName ? `**제품명:** ${productName}` : '**제품명:** 미입력'}
**제형:** ${formKorean}
**1회 제공량:** ${serving_size?.value}${serving_size?.unit}

**영양성분표 (검출된 모든 성분):**
${nutrientDetails}

# 약사 관점의 건강기능식품 전문 분석 요구사항

당신은 약국에서 고객에게 건강기능식품을 추천하고 복약지도를 하는 **전문 약사**입니다. 
제품명 "${productName || '미입력'}", 제형 "${formKorean}", 그리고 위의 **모든 영양성분과 기능성 원료**를 면밀히 분석하여, 
**식약처 기준 준수 여부, 비타민/미네랄 함량의 적정성, 약물 상호작용, 부작용 위험, 적합/부적합 대상** 등을 
약사의 전문적 시각에서 상세히 평가해주세요.

## 필수 분석 성분 (검출 시 반드시 분석)
다음 성분들이 영양성분표에 있다면 **반드시 개별 분석**하고 식약처 기준 준수 여부를 평가하세요:

**비타민류:**
- 비타민A, 비타민B군(B1/티아민, B2/리보플라빈, B3/나이아신, B5/판토텐산, B6, B7/비오틴, B9/엽산, B12)
- 비타민C, 비타민D, 비타민E, 비타민K

**미네랄류:**
- 칼슘, 마그네슘, 아연, 철, 인, 요오드, 셀레늄, 구리, 망간, 크롬, 몰리브덴, 칼륨

**기능성 원료:**
- 오메가-3 지방산(EPA, DHA), 프로바이오틱스, 식이섬유
- 코엔자임Q10, 홍삼, 루테인, 밀크씨슬, 글루코사민, 콜라겐 등

위 성분들이 검출되면 **각 성분의 식약처 1일 섭취권장량 대비 비율**을 계산하고,
- **부족(50% 미만)**: "OO 성분이 권장량의 XX%로 부족합니다"
- **적정(50-100%)**: "OO 성분이 권장량의 XX%로 적정합니다"  
- **과다(100-150%)**: "OO 성분이 권장량의 XX%로 다소 높습니다. 다른 보충제와 중복 섭취 주의"
- **위험(150% 이상)**: "OO 성분이 권장량의 XX%로 과다합니다. 장기 복용 시 부작용 위험"

이러한 분석을 바탕으로 약사로서 전문적 의견을 제시하세요.

## 1. 종합 요약 (summary)
- 약사 관점에서 이 제품의 안전성과 효능을 1-2문장으로 평가
- 건강기능식품 여부 및 주요 기능성 원료 명시
- 전체적인 품질 수준 (우수/양호/보통/미흡/위험)

## 2. 건강기능적 장점 (highlights)
- **식약처 인정 기능성**만을 기재 (3-5가지)
- 검출된 성분의 실제 효능 중심
- 예: "비타민C 1000mg 함유 - 항산화 및 면역력 증진", "칼슘 500mg - 골다공증 예방"

## 3. 약사 관점 주의사항 (cautions) ⭐중요⭐
- **약물 상호작용**: 와파린, 당뇨약, 혈압약 등과의 상호작용
- **특정 질환자 금기**: 신장질환, 간질환, 갑상선질환 등
- **임산부/수유부 주의**: 비타민A 과다, 특정 허브 등
- **연령 제한**: 어린이/노인 섭취 시 주의사항
- **과다섭취 부작용**: 각 성분별 과량 섭취 시 발생 가능한 부작용
- **알레르기**: 갑각류(글루코사민), 대두, 우유 등

## 4. 영양학적 상세 분석 (nutritional_analysis)

### energy_analysis
- 열량이 적정한지 평가 (보충제형은 50kcal 이하 권장)
- 식사대용형인지 보조제형인지 판단

### macronutrient_balance  
- 단백질/지방/탄수화물 비율 평가
- 특정 영양소 강화형 제품인지 분석

### micronutrient_evaluation ⭐핵심⭐
- **검출된 모든 비타민/미네랄을 개별 분석**
- 각 성분의 식약처 기준 대비 비율 명시
- 예: "비타민C 1000mg (기준치 1000%) - 상한선 초과, 엽산 200μg (기준치 50%) - 부족"
- 부족/과다 성분 명확히 지적

## 5. 식약처 규정 준수 평가 (kfda_compliance)

### labeling_status
- 영양성분 표시기준 준수 여부
- 기능성 원료 함량의 적정성
- 필수 표시사항 누락 여부

### health_claims  
- **식약처 고시 기능성 문구만 사용**
- 검출된 성분에 해당하는 인정 문구만 표시
- 예:
  * "비타민C: 항산화 작용, 결합조직 형성, 철 흡수에 필요"
  * "칼슘: 뼈와 치아 형성, 골다공증 발생 위험 감소에 도움"
  * "엽산: 세포와 혈액생성, 태아 신경관 정상발달에 필요"
  * "아연: 정상적인 면역기능, 세포분열에 필요"

### warnings ⭐약사 관점 경고⭐
- "질병 치료 목적으로 사용할 수 없습니다"
- 약물 상호작용 주의 문구
- 특정 질환자/임산부 복용 전 상담 필요
- 1일 섭취량 준수 경고

## 6. 건강기능식품 분석 (functional_food_analysis)

### classification
- 건강기능식품 여부 최종 판단
- 주요 기능성 원료 나열 (실제 검출된 것만)
- 예: "영양소 보충용 건강기능식품 (비타민C, 아연, 칼슘, 마그네슘 함유)"

### functionality
- **검출된 성분의 식약처 인정 기능성만 나열** (3-6가지)
- 면역/뼈/항산화/피로개선/장건강 등 구체적 효능

### intake_recommendations ⭐약사 복약지도⭐
- **1일 권장 섭취량 및 횟수**
- **섭취 시기**: 식후/식전/취침전 등
- **섭취 방법**: 물과 함께, 씹어서 등
- **섭취 기간**: 최소 2주, 최대 3개월 등
- **병용 주의**: 다른 영양제와 중복 섭취 시 총량 확인
- **보관 방법**: 실온/냉장 보관

## 7. 약사 전문 의견 (추가)
- 이 제품의 전반적인 품질과 안전성 평가
- 어떤 사람에게 추천하고, 누구는 피해야 하는지
- 더 나은 대체 제품이 필요한지 여부
- 가격 대비 효능의 합리성

# 중요 지침
1. **모든 검출된 비타민/미네랄을 빠짐없이 분석**
2. **식약처 기준 대비 %를 반드시 계산하여 제시**
3. **약물 상호작용을 구체적으로 명시** (와파린, 당뇨약 등)
4. **임산부/어린이/노인/질환자별 주의사항 구분**
5. **과다 섭취 시 부작용을 성분별로 명시**
6. **식약처 미인정 효능은 절대 표시 금지**

# 출력 형식
반드시 아래 JSON 형식으로 응답하세요:

{
  "summary": "약사 관점의 종합 평가 (품질 등급 포함)",
  "highlights": ["실제 검출된 성분의 효능1", "효능2", "효능3"],
  "cautions": ["약물상호작용", "질환자주의", "과다섭취부작용", "임산부주의"],
  "nutritional_analysis": {
    "energy_analysis": "열량 평가",
    "macronutrient_balance": "3대 영양소 분석",
    "micronutrient_evaluation": "비타민A 기준치 120%, 엽산 기준치 45% (부족), 칼슘 기준치 80% 등 상세 분석"
  },
  "kfda_compliance": {
    "labeling_status": "표시기준 평가",
    "health_claims": ["식약처 인정 기능성1", "식약처 인정 기능성2"],
    "warnings": ["주의문구1", "주의문구2"]
  },
  "functional_food_analysis": {
    "classification": "건강기능식품 분류 및 원료",
    "functionality": ["기능성1", "기능성2", "기능성3"],
    "intake_recommendations": "섭취 권장사항"
  }
}`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('No response from Gemini');
    }
    
    const parsed = JSON.parse(content);
    
    return {
      summary: parsed.summary || '영양 정보 분석 완료',
      highlights: parsed.highlights || [],
      cautions: parsed.cautions || [],
      nutritional_analysis: parsed.nutritional_analysis,
      kfda_compliance: parsed.kfda_compliance,
      functional_food_analysis: parsed.functional_food_analysis,
    };
  } catch (error) {
    console.error('LLM Error:', error);
    
    // Fallback summary
    return {
      summary: `1회 ${serving_size?.value}${serving_size?.unit} 섭취 시 영양 정보가 분석되었습니다.`,
      highlights: ['영양 성분 표시 확인'],
      cautions: ['상세한 영양 상담이 필요한 경우 전문가와 상담하세요'],
    };
  }
}

/**
 * 영양소 한글명 매핑
 */
function getNutrientKoreanName(key: string): string {
  const names: Record<string, string> = {
    energy: '열량',
    protein: '단백질',
    fat_total: '지방',
    fat_saturated: '포화지방',
    fat_trans: '트랜스지방',
    carbohydrate: '탄수화물',
    sugar: '당류',
    sodium: '나트륨',
    cholesterol: '콜레스테롤',
    fiber: '식이섬유',
  };
  return names[key] || key;
}
