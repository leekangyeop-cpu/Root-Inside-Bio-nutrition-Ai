import OpenAI from 'openai';
import { AISummary } from './validate';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Generate AI summary using OpenAI GPT-4
 */
export async function generateSummary(nutritionData: any): Promise<AISummary> {
  const { serving_size, nutrients, dv } = nutritionData;
  
  const prompt = `당신은 Root Inside BioNutrition의 영양 표시 검토 전문가입니다.

다음 영양 정보를 분석하여 한국어로 요약해주세요:

**1회 제공량:** ${serving_size?.value}${serving_size?.unit}

**영양성분:**
${Object.entries(nutrients).map(([key, data]: [string, any]) => `- ${key}: ${data.value}${data.unit}`).join('\n')}

**영양소 기준치 (% DV):**
${dv ? Object.entries(dv).map(([key, val]) => `- ${key}: ${val}%`).join('\n') : '없음'}

**요구사항:**
1. 핵심 영양 정보를 1-2문장으로 요약
2. 건강상 장점 3가지 이내 (배열)
3. 주의사항 2가지 이내 (배열)

반드시 다음 JSON 형식으로 응답하세요:
{
  "summary": "요약 문장",
  "highlights": ["장점1", "장점2"],
  "cautions": ["주의사항1"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition label analysis expert. Always respond in valid JSON format in Korean.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }
    
    const parsed = JSON.parse(content);
    
    return {
      summary: parsed.summary || '영양 정보 분석 완료',
      highlights: parsed.highlights || [],
      cautions: parsed.cautions || [],
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
