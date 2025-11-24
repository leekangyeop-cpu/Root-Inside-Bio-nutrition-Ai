# Root Inside BioNutrition AI - MVP Setup Guide

## 🚀 빠른 시작

### 1. 의존성 설치

```powershell
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 입력하세요:

```env
AZURE_VISION_ENDPOINT=https://<your-region>.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-azure-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

#### API 키 발급 방법:

**Azure Computer Vision:**
1. [Azure Portal](https://portal.azure.com) 접속
2. "Computer Vision" 리소스 생성
3. "Keys and Endpoint" 섹션에서 키와 엔드포인트 복사

**OpenAI:**
1. [OpenAI Platform](https://platform.openai.com) 접속
2. API Keys 메뉴에서 새 키 생성
3. GPT-4 모델 접근 권한 확인

### 3. 개발 서버 실행

```powershell
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인하세요.

---

## 📁 프로젝트 구조

```
Root-Inside-Bio-nutrition-Ai/
├── app/
│   ├── api/
│   │   ├── review/route.ts       # 메인 워크플로우 엔드포인트
│   │   ├── ocr/route.ts          # OCR 처리
│   │   └── summarize/route.ts    # AI 요약
│   ├── page.tsx                  # 메인 UI
│   ├── layout.tsx                # 레이아웃
│   └── globals.css               # 전역 스타일
├── lib/
│   ├── ocr.ts                    # Azure OCR 래퍼
│   ├── mapping.ts                # 영양소 이름 정규화
│   ├── validate.ts               # Zod 스키마 & 검증
│   ├── dv.ts                     # %DV 계산
│   ├── llm.ts                    # OpenAI 요약
│   └── utils.ts                  # 유틸리티 함수
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎨 디자인 특징

### 바이오/전문성 테마
- **색상 팔레트:**
  - Bio Green: `#22c55e` - 생명력, 건강
  - Earth Tones: `#f5f3ef`, `#9d8f76` - 자연스러움, 전문성
  
- **타이포그래피:**
  - 시스템 폰트 + Noto Sans KR
  - 명확한 계층 구조

- **레이아웃:**
  - 깔끔한 카드 기반 디자인
  - 부드러운 그라데이션과 섀도우
  - 반응형 그리드 시스템

---

## 🔧 주요 기능

### 1. 파일 업로드
- PDF, JPG, PNG 지원
- 드래그 앤 드롭 인터페이스
- 실시간 파일 상태 표시

### 2. OCR 처리
- Azure Computer Vision Read API 사용
- 한글/영어 영양 성분표 인식
- 자동 텍스트 파싱

### 3. 데이터 검증
- Zod 스키마 기반 검증
- 영양소 이름 정규화
- 단위 변환 및 표준화

### 4. %DV 계산
- 한국 영양소 기준치 적용
- 자동 퍼센트 계산
- 1 소수점 반올림

### 5. AI 요약
- OpenAI GPT-4 활용
- 한국어 자연어 요약
- 장점/주의사항 자동 추출

### 6. 결과 다운로드
- JSON 형식으로 내보내기
- 타임스탬프 포함
- 표준화된 데이터 구조

---

## 🔌 API 사용 예제

### POST /api/review

전체 워크플로우를 실행합니다 (OCR → 검증 → 계산 → AI 요약).

```bash
curl -X POST http://localhost:3000/api/review \
  -F "file=@nutrition-label.pdf"
```

**응답 예시:**
```json
{
  "meta": {
    "product": "nutrition-label.pdf",
    "batch": "2025-11-24"
  },
  "serving_size": {
    "value": 30,
    "unit": "g"
  },
  "nutrients": {
    "energy": { "value": 120, "unit": "kcal" },
    "protein": { "value": 10, "unit": "g" },
    "fat_total": { "value": 2.5, "unit": "g" },
    "carbohydrate": { "value": 12, "unit": "g" },
    "sodium": { "value": 180, "unit": "mg" }
  },
  "dv": {
    "protein": 20,
    "sodium": 9
  },
  "ai_summary": {
    "summary": "1회 30g 섭취 시 단백질 10g(20% DV), 나트륨 180mg(9% DV)로 균형적입니다.",
    "highlights": ["단백질 함량 우수", "나트륨 적정 수준"],
    "cautions": ["전문가 상담 권장"]
  }
}
```

---

## 🐛 문제 해결

### OCR이 작동하지 않음
- Azure 엔드포인트 URL 형식 확인 (끝에 `/` 포함)
- API 키 유효성 확인
- 파일 크기 4MB 이하 확인

### AI 요약 오류
- OpenAI API 키 확인
- GPT-4 모델 접근 권한 확인
- API 사용량 제한 확인

### 빌드 오류
```powershell
# 캐시 삭제 후 재설치
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run dev
```

---

## 🚀 배포 (Vercel)

### 1. GitHub에 푸시
```powershell
git add .
git commit -m "Initial MVP"
git push origin main
```

### 2. Vercel 배포
1. [vercel.com](https://vercel.com)에 접속
2. GitHub 레포지토리 연결
3. 환경 변수 추가:
   - `AZURE_VISION_ENDPOINT`
   - `AZURE_VISION_KEY`
   - `OPENAI_API_KEY`
4. Deploy 클릭

---

## 📝 법적 고지

이 시스템은 참고용 영양 정보 요약을 제공합니다.

- 최종 표시 검증과 규제 준수는 제조사의 책임입니다
- Root Inside 그룹과 개발자는 이 데이터에 기반한 결정에 대해 책임지지 않습니다
- 전문 영양사 또는 규제 전문가의 검증을 권장합니다

---

## 📧 문의

**Root Inside Co., Ltd.**  
Aiden, Founder & Principal Consultant  
GitHub: [leekangyeop-cpu](https://github.com/leekangyeop-cpu)

---

**Built with ❤️ for CozymeMom Bio and food manufacturers**
