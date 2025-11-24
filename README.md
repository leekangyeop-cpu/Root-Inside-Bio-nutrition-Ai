# Root Inside BioNutrition AI (MVP)

AI-powered nutrition label OCR, validation, and **pharmacist-level analysis** system for food manufacturers and consumers.

**Input:** PDF/Image (nutrition facts label)  
**Output:** Standardized JSON + AI-generated summary + **Pharmacist Professional Analysis**

---

## ✨ 주요 기능

### 🔬 약사 관점 전문 분석
- **비타민 13종 완전 분석**: A, B1-B12, C, D, E, K
- **미네랄 12종 완전 분석**: 칼슘, 마그네슘, 아연, 철, 인, 요오드, 셀레늄, 구리, 망간, 크롬, 몰리브덴, 칼륨
- **식약처 기준 대비 정확한 준수율 계산** (0-100%)
- **약물 상호작용 자동 감지** (항응고제, 당뇨약, 혈압약)
- **질환자/임산부/어린이별 맞춤 주의사항**
- **복용 가이드라인 자동 생성**

### 📊 영양성분 분석
- OCR을 통한 영양성분표 자동 인식
- 식약처 기준 영양소 기준치(%NRV) 자동 계산
- 건강기능식품 분류 및 기능성 원료 식별

### 🤖 AI 기반 상세 리포트
- Google Gemini를 활용한 자연어 요약
- 식약처 인정 기능성만 정확히 표시
- 개인 맞춤형 섭취 권장사항

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/<your-username>/root-inside-bionutrition.git
cd root-inside-bionutrition

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload a nutrition label PDF.

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Azure Computer Vision** account ([Sign up](https://azure.microsoft.com/services/cognitive-services/computer-vision/))
- **Google Gemini API** key ([Get key](https://aistudio.google.com/app/apikey))
- (Optional) **Vercel** account for deployment

---

## ⚙️ Installation

### 1. Environment Variables

Create `.env.local` in the project root:

```bash
AZURE_VISION_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-azure-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### 2. Install Dependencies

```bash
npm install
```

Required packages:
- `next` - Framework
- `@azure/cognitiveservices-computervision` - OCR
- `openai` - AI summarization
- `zod` - Schema validation
- `@vercel/blob` - File storage (optional)

### 3. Run Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

```
root-inside-bionutrition/
├── app/
│   ├── page.tsx                    # Upload UI
│   └── api/
│       ├── review/route.ts         # Main workflow endpoint
│       ├── ocr/route.ts            # OCR processing (optional)
│       └── summarize/route.ts      # AI summarization
├── lib/
│   ├── ocr.ts                      # Azure OCR wrapper
│   ├── mapping.ts                  # Nutrient name normalization
│   ├── validate.ts                 # Zod schemas & validation
│   ├── dv.ts                       # %DV calculation module
│   ├── llm.ts                      # OpenAI function calling
│   └── utils.ts                    # Unit conversion utilities
├── .env.local                      # Environment variables
├── .env.example                    # Example env file
└── package.json
```

---

## 🔌 API Reference

### `POST /api/review`

Main endpoint that processes nutrition label PDFs through the complete workflow.

**Request:**
```bash
curl -X POST http://localhost:3000/api/review \
  -F "file=@nutrition-label.pdf"
```

**Response:**
```json
{
  "meta": {
    "product": "코지맘 밀크 프로틴 파우더",
    "batch": "2025-01"
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
    "cautions": ["당류 섭취량 확인 필요"]
  }
}
```

**Processing Steps:**
1. OCR → Extract text from PDF
2. Parse → Normalize nutrient names and units
3. Validate → Check value ranges and units
4. Calculate → Apply %DV standards
5. Summarize → Generate AI insights (JSON mode)
6. Return → Structured JSON + natural language summary

---

## 🧩 Core Modules

### 1. OCR Module (`lib/ocr.ts`)

```typescript
import { extractTextFromPDF } from '@/lib/ocr';

const buffer = await file.arrayBuffer();
const ocrText = await extractTextFromPDF(Buffer.from(buffer));
```

### 2. Validation Module (`lib/validate.ts`)

```typescript
import { NutrientSchema } from '@/lib/validate';

const validated = NutrientSchema.parse(rawData);
```

**Validation Rules:**
- Units: g / mg / kcal / % only
- Required: energy, protein, fat, carbohydrate, sodium
- Rounding: 1 decimal place
- Range: No negatives, realistic upper bounds

### 3. %DV Calculation (`lib/dv.ts`)

```typescript
import { calculateDV } from '@/lib/dv';

const dvPercent = calculateDV('protein', 10); // Returns 20 (10g / 50g * 100)
```

**Reference Standards:**
- Protein: 50g
- Sodium: 2000mg
- Sugar: 100g

### 4. AI Summarization (`lib/llm.ts`)

```typescript
import { generateSummary } from '@/lib/llm';

const summary = await generateSummary(validatedData);
```

**LLM Prompt Template:**
```
You are a nutrition label reviewer for CozymeMom Bio.
Given structured nutrition facts (verified JSON),
summarize key points and health highlights in Korean.
Never recalculate numbers. Return strict JSON:
{
  "summary": "",
  "highlights": [],
  "cautions": []
}
```

---

## 🛠️ Development Guide

### Adding New Nutrients

1. Update `lib/mapping.ts`:
```typescript
export const NUTRIENT_MAPPING = {
  'vitamin_c': ['비타민C', '비타민 C', 'Vitamin C'],
  // Add synonyms
};
```

2. Update `lib/validate.ts`:
```typescript
const NutrientSchema = z.object({
  // ...
  vitamin_c: z.number().min(0).max(1000).optional(),
});
```

3. Update `lib/dv.ts` if %DV reference exists:
```typescript
export const DV_REFERENCE = {
  // ...
  vitamin_c: 100, // mg
};
```

### Testing

```bash
# Run tests
npm test

# Test specific API endpoint
npm run test:api

# Test OCR module
npm run test:ocr
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables
   - Click Deploy

3. Your app will be live at: `https://your-project.vercel.app`

### Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `AZURE_VISION_ENDPOINT`
- `AZURE_VISION_KEY`
- `OPENAI_API_KEY`

---

## 🔧 Troubleshooting

### OCR Not Working
- Verify Azure endpoint URL format (must end with `/`)
- Check API key is valid
- Ensure file size < 4MB

### AI Summary Returning Errors
- Check OpenAI API key
- Verify you have GPT-4 access
- Check rate limits

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| OCR | Azure Computer Vision Read API |
| AI | OpenAI GPT-4 (Function Calling) |
| Validation | Zod |
| Storage | Vercel Blob / Supabase |
| Deployment | Vercel (Serverless) |

---

## 🔐 Legal Notice

This system provides automated nutrition information summarization for reference purposes only.

- Final label verification and regulatory compliance is the manufacturer's responsibility
- Root Inside Group and developers are not liable for decisions made based on this data
- Always verify AI outputs with certified nutritionists or regulatory experts

---

## 📈 Future Enhancements (SaaS Roadmap)

For multi-tenant SaaS deployment:

| Feature | Implementation |
|---------|---------------|
| Authentication | Supabase Auth / Clerk |
| Payments | Stripe / Toss Payments |
| Multi-tenancy | Database-level isolation |
| Usage Limits | OCR call-based metering |
| Report Export | JSON → PDF/CSV conversion |
| Disclaimer | Auto-include on all outputs |

---

## 📝 License

Proprietary - Root Inside Co., Ltd.

---

## 📧 Contact

**Root Inside Co., Ltd.**  
Aiden, Founder & Principal Consultant  
[your-email@rootinside.ai](mailto:your-email@rootinside.ai)

---

## 🎯 Workflow Diagram

```
PDF Upload
    ↓
Azure OCR (Text Extraction)
    ↓
Regex Parsing (Nutrient Normalization)
    ↓
Zod Validation (Schema + Range Checks)
    ↓
%DV Calculation (Reference Standards)
    ↓
OpenAI Summary (Function Calling)
    ↓
JSON Response + Download
```

**Built for CozymeMom Bio and food manufacturers requiring automated nutrition label verification.**
