# 약사 관점 영양성분 분석 시스템

## 개요

이 시스템은 건강기능식품의 영양성분을 **약사의 전문적 관점**에서 분석하여, 식약처 기준 준수 여부, 비타민/미네랄 함량의 적정성, 약물 상호작용, 부작용 위험 등을 상세히 평가합니다.

## 주요 기능

### 1. 확장된 기능성 원료 데이터베이스
- **비타민 13종**: A, B1, B2, B3, B5, B6, B7, B9(엽산), B12, C, D, E, K
- **미네랄 12종**: 칼슘, 마그네슘, 아연, 철, 인, 요오드, 셀레늄, 구리, 망간, 크롬, 몰리브덴, 칼륨
- **기능성 원료**: 오메가-3, 프로바이오틱스, 식이섬유, 코엔자임Q10, 홍삼, 루테인, 밀크씨슬, 글루코사민, 콜라겐 등

각 원료마다 다음 정보 포함:
- 식약처 인정 기능성
- 1일 섭취 권장 범위
- 주의사항 및 금기사항
- 적합 대상 그룹

### 2. 약사 관점 상세 분석 (`lib/pharmacist-analysis.ts`)

#### 성분별 분석
- **자동 성분명 표준화**: 다양한 표기법(한글/영문/약어)을 자동 인식
- **섭취량 상태 판정**:
  - `deficient`: 권장량의 50% 미만
  - `optimal`: 권장량 범위 내 (50-100%)
  - `excessive`: 권장량 초과 (100-150%)
  - `dangerous`: 위험 수준 (150% 이상)

#### 준수율 계산
- 각 성분의 식약처 기준 대비 백분율 계산
- 전체 준수율 점수 (0-100)
- 종합 등급: excellent / good / acceptable / poor / dangerous

#### 약물 상호작용 체크
- 항응고제(와파린) 상호작용
- 당뇨약과의 혈당 영향
- 혈압약과의 상호작용

#### 금기 대상 식별
- 임산부 주의 성분
- 신장질환자 금기
- 간질환자 금기
- 특정 알레르기 주의

#### 복용 가이드라인 생성
- 1일 권장 섭취량 및 횟수
- 섭취 시기 (식전/식후)
- 주의사항 및 보관방법

#### 전문가 권고사항
- 약사 관점의 종합 평가
- 적합/부적합 대상 명시
- 대체 제품 필요 여부

### 3. 개선된 LLM 프롬프트 (`lib/llm.ts`)

#### 약사 전문성 강화
- "건강기능식품 전문 약사" 페르소나 적용
- 복약지도 수준의 상세한 안내
- 성분별 식약처 기준 대비 % 계산 요구
- 약물 상호작용 구체적 명시

#### 필수 분석 항목
1. **모든 검출 성분 개별 분석**
2. **식약처 기준 대비 비율 계산**
3. **약물 상호작용 명시**
4. **질환자/임산부/어린이별 주의사항**
5. **과다섭취 시 부작용 성분별 명시**

### 4. API 응답 강화 (`app/api/summarize/route.ts`)

기존 AI 요약에 더해 `pharmacist_analysis` 필드 추가:

```json
{
  "success": true,
  "summary": { /* AI 생성 요약 */ },
  "pharmacist_analysis": {
    "overallRating": "good",
    "complianceScore": 85,
    "analyzedIngredients": [
      {
        "koreanName": "비타민C",
        "detectedAmount": 1000,
        "unit": "mg",
        "dailyIntakeRange": "100~1000mg",
        "status": "optimal",
        "compliancePercentage": 100,
        "kfdaApproval": true,
        "functionality": ["항산화", "면역력"],
        "precautions": ["과다섭취 시 설사"],
        "pharmacistNote": "식약처 기준 적정 범위 내"
      }
    ],
    "complianceIssues": [
      {
        "severity": "warning",
        "ingredient": "엽산",
        "issue": "함량이 최소량 미달",
        "recommendation": "최소 120μg 이상 증량 권장",
        "kfdaReference": "120~400μg"
      }
    ],
    "drugInteractions": [
      "비타민K: 와파린 등 항응고제와 상호작용 가능"
    ],
    "contraindicatedFor": [
      "임산부(비타민A)",
      "신장질환자(칼륨)"
    ],
    "appropriateFor": [
      "면역력 개선(비타민C)",
      "뼈 건강(칼슘)"
    ],
    "dosageGuidance": "【복용 가이드라인】...",
    "professionalRecommendation": "【약사 전문 의견】...",
    "regulatoryStatus": {
      "kfdaCompliant": true,
      "healthFunctionalFood": true,
      "requiresPrescription": false,
      "ageRestrictions": []
    }
  }
}
```

## 사용 예시

### 1. OCR로 영양성분표 스캔
```
POST /api/ocr
Content-Type: multipart/form-data

이미지 파일 업로드
```

### 2. 약사 관점 분석 요청
```
POST /api/summarize
Content-Type: application/json

{
  "productName": "멀티비타민 미네랄",
  "productForm": "tablet",
  "serving_size": { "value": 1, "unit": "ea" },
  "nutrients": {
    "vitamin_c": { "value": 1000, "unit": "mg" },
    "vitamin_d": { "value": 25, "unit": "μg" },
    "calcium": { "value": 500, "unit": "mg" },
    "magnesium": { "value": 150, "unit": "mg" },
    "zinc": { "value": 10, "unit": "mg" },
    "vitamin_b9": { "value": 80, "unit": "μg" }
  }
}
```

### 3. 응답 확인
- AI 요약: 일반인 친화적 설명
- 약사 분석: 전문적이고 상세한 평가
  - 각 성분의 적정성
  - 부족/과다 성분 지적
  - 약물 상호작용 경고
  - 복용 가이드라인
  - 전문가 권고사항

## 핵심 개선사항

### 이전 버전
- ❌ 기본 영양성분만 분석 (열량, 단백질, 지방, 탄수화물, 나트륨)
- ❌ 비타민/미네랄 상세 분석 부족
- ❌ 식약처 기준 준수 여부 모호
- ❌ 약물 상호작용 정보 없음

### 현재 버전
- ✅ **비타민 13종, 미네랄 12종 완전 분석**
- ✅ **식약처 기준 대비 정확한 % 계산**
- ✅ **약사 수준의 전문 분석**
- ✅ **약물 상호작용 상세 안내**
- ✅ **질환자/임산부별 맞춤 주의사항**
- ✅ **부족/과다 성분 자동 감지 및 권고**
- ✅ **복용 가이드라인 자동 생성**

## 기술 스택
- TypeScript
- Next.js 14 (App Router)
- Google Gemini 2.5 Flash (AI 분석)
- Zod (데이터 검증)

## 참고 문헌
- 식품의약품안전처 건강기능식품 기준 및 규격
- 한국영양학회 영양소 섭취기준
- 대한약사회 복약지도 가이드라인
