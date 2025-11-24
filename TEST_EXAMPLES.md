# 약사 관점 분석 테스트 예제

## 테스트 케이스 1: 멀티비타민 제품

### 요청
```bash
curl -X POST http://localhost:3002/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "종합비타민미네랄",
    "productForm": "tablet",
    "serving_size": { "value": 1, "unit": "ea" },
    "nutrients": {
      "energy": { "value": 5, "unit": "kcal" },
      "vitamin_c": { "value": 1000, "unit": "mg" },
      "vitamin_d": { "value": 25, "unit": "μg" },
      "vitamin_e": { "value": 50, "unit": "mg" },
      "vitamin_b1": { "value": 1.2, "unit": "mg" },
      "vitamin_b2": { "value": 1.4, "unit": "mg" },
      "vitamin_b6": { "value": 1.5, "unit": "mg" },
      "vitamin_b9": { "value": 80, "unit": "μg" },
      "vitamin_b12": { "value": 2.4, "unit": "μg" },
      "calcium": { "value": 500, "unit": "mg" },
      "magnesium": { "value": 150, "unit": "mg" },
      "zinc": { "value": 10, "unit": "mg" },
      "iron": { "value": 8, "unit": "mg" },
      "selenium": { "value": 55, "unit": "μg" }
    }
  }'
```

### 예상 분석 결과

#### 1. 전체 준수율
- **complianceScore**: 약 75-85점
- **overallRating**: "good"

#### 2. 성분별 분석
- ✅ **비타민C (1000mg)**: optimal (기준치 100%)
- ✅ **비타민D (25μg)**: optimal (기준치 50%)
- ⚠️ **비타민E (50mg)**: excessive (기준치 125%, 상한선 근접)
- ⚠️ **엽산 (80μg)**: deficient (기준치 67%, 최소량 미달)
- ✅ **칼슘 (500mg)**: optimal (기준치 63%)
- ✅ **아연 (10mg)**: optimal (기준치 77%)

#### 3. 문제점 및 권고사항
```
⚠️ 엽산 함량 부족
- 현재: 80μg (기준치 67%)
- 권장: 최소 120μg 이상
- 대상: 임산부, 가임기 여성에게 특히 중요

⚠️ 비타민E 과다
- 현재: 50mg (기준치 125%)
- 권장: 40mg 이하로 감량
- 주의: 항응고제 복용자 출혈 위험 증가
```

#### 4. 약물 상호작용
- 비타민E + 비타민K: 항응고제(와파린) 복용자 주의
- 칼슘: 테트라사이클린 항생제와 2시간 간격 필요
- 철분: 제산제와 함께 복용 금지

#### 5. 복용 가이드라인
```
【복용 방법】
- 1일 1회, 1정
- 식후 30분 이내 복용 (흡수율 증가)
- 충분한 물과 함께 섭취

【주의사항】
- 다른 멀티비타민과 중복 복용 금지
- 임산부는 전문의 상담 후 복용
- 항응고제 복용자는 의사와 상담 필요
```

---

## 테스트 케이스 2: 칼슘+비타민D 제품

### 요청
```json
{
  "productName": "칼슘마그네슘비타민D",
  "productForm": "tablet",
  "serving_size": { "value": 2, "unit": "ea" },
  "nutrients": {
    "energy": { "value": 10, "unit": "kcal" },
    "calcium": { "value": 800, "unit": "mg" },
    "magnesium": { "value": 300, "unit": "mg" },
    "vitamin_d": { "value": 50, "unit": "μg" },
    "vitamin_k": { "value": 80, "unit": "μg" },
    "zinc": { "value": 5, "unit": "mg" }
  }
}
```

### 예상 분석 결과

#### 성분 상태
- ✅ **칼슘 (800mg)**: optimal (기준치 100%)
- ⚠️ **마그네슘 (300mg)**: excessive (기준치 86%, 상한선 근접)
- ✅ **비타민D (50μg)**: optimal (기준치 100%)
- ✅ **비타민K (80μg)**: optimal (기준치 80%)

#### 적합 대상
- ✅ 골다공증 예방 (폐경기 여성)
- ✅ 성장기 어린이/청소년
- ✅ 노인 뼈 건강
- ✅ 실내 생활자 (비타민D 부족)

#### 금기 대상
- 🚫 **항응고제 복용자** (비타민K 포함)
- ⚠️ **신장질환자** (칼슘/마그네슘 과다)
- ⚠️ **고칼슘혈증 환자**

---

## 테스트 케이스 3: 오메가-3 + 종합 영양제

### 요청
```json
{
  "productName": "프리미엄 오메가3 멀티비타민",
  "productForm": "capsule",
  "serving_size": { "value": 2, "unit": "ea" },
  "nutrients": {
    "energy": { "value": 15, "unit": "kcal" },
    "fat_total": { "value": 1.5, "unit": "g" },
    "omega3": { "value": 1200, "unit": "mg" },
    "vitamin_e": { "value": 100, "unit": "mg" },
    "vitamin_a": { "value": 600, "unit": "μg" },
    "vitamin_d": { "value": 20, "unit": "μg" },
    "selenium": { "value": 100, "unit": "μg" }
  }
}
```

### 예상 분석 결과

#### 성분 상태
- ✅ **오메가-3 (1200mg)**: optimal (EPA+DHA 권장량 500-2000mg 범위)
- 🚫 **비타민E (100mg)**: dangerous (기준치 250%, 상한선 초과)
- ⚠️ **비타민A (600μg)**: excessive (기준치 120%)
- ⚠️ **셀레늄 (100μg)**: excessive (기준치 150%, 주의 필요)

#### 심각한 문제점
```
🚫 비타민E 과다 (위험 수준)
- 현재: 100mg (상한선 400mg의 25%)
- 문제: 항응고 작용 증폭, 출혈 위험
- 권고: 즉시 섭취량 감량 또는 제품 교체
- 금기: 수술 예정자, 항응고제 복용자
```

#### 약물 상호작용 (중요)
- ⚠️ **오메가-3 + 비타민E + 와파린** = 출혈 위험 3배 증가
- ⚠️ **비타민A** = 임산부 기형아 위험
- ⚠️ **셀레늄 과다** = 탈모, 손톱 변형

---

## 웹 UI에서 테스트

1. http://localhost:3002 접속
2. 영양성분표 이미지/PDF 업로드
3. OCR 자동 인식 후 "분석 시작" 클릭
4. 결과 확인:
   - **AI 요약**: 일반인 친화적 설명
   - **약사 전문 분석**: 상세한 전문가 평가
     - 준수율 점수
     - 성분별 상태
     - 문제점 및 권고사항
     - 약물 상호작용
     - 복용 가이드라인

---

## 기대 효과

### 소비자 입장
- ✅ 내가 먹는 영양제가 안전한지 전문가 수준으로 확인
- ✅ 복용 중인 약과 상호작용 없는지 미리 체크
- ✅ 임신/수유 중 안전한지 확인
- ✅ 과다/부족 성분 파악하여 다른 제품과 조합

### 제조사/유통사 입장
- ✅ 식약처 기준 준수 여부 자동 검증
- ✅ 제품 개선 포인트 자동 도출
- ✅ 소비자 신뢰도 향상
- ✅ 법적 리스크 사전 차단

### 약사 입장
- ✅ 복약지도 시 객관적 데이터 활용
- ✅ 영양제 추천 시 과학적 근거 제시
- ✅ 약물 상호작용 자동 체크
- ✅ 업무 효율성 대폭 향상
