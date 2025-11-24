import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, parseNutritionText } from '@/lib/ocr';
import { NutritionLabelSchema } from '@/lib/validate';
import { calculateAllDV } from '@/lib/dv';
import { generateSummary } from '@/lib/llm';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Main workflow endpoint: OCR → Parse → Validate → Calculate DV → AI Summary
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Step 1: OCR - Extract text from PDF/Image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ocrText = await extractTextFromPDF(buffer);
    
    // Step 2: Parse - Extract nutrition data
    const parsedData = parseNutritionText(ocrText);
    
    // Step 3: Validate - Ensure data structure is correct
    let validated;
    try {
      validated = NutritionLabelSchema.parse(parsedData);
    } catch (validationError) {
      // If validation fails, try to provide partial data
      console.warn('Validation warning:', validationError);
      validated = parsedData;
    }
    
    // Step 4: Calculate %DV (Daily Value percentages)
    const dv = calculateAllDV(validated.nutrients || {});
    
    // Step 5: Generate AI Summary
    const aiSummary = await generateSummary({
      ...validated,
      dv,
    });
    
    // Step 6: Compile final response
    const response = {
      meta: validated.meta || { product: file.name, batch: new Date().toISOString().split('T')[0] },
      serving_size: validated.serving_size,
      nutrients: validated.nutrients,
      dv,
      ai_summary: aiSummary,
      _debug: {
        ocrText: ocrText.substring(0, 500), // First 500 chars for debugging
        filename: file.name,
        timestamp: new Date().toISOString(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Review API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process nutrition label',
        details: String(error),
        message: 'OCR 또는 AI 처리 중 오류가 발생했습니다. API 키를 확인해주세요.'
      },
      { status: 500 }
    );
  }
}
