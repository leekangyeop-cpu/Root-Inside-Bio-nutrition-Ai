import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, parseNutritionText } from '@/lib/ocr';

export const runtime = 'nodejs';
export const maxDuration = 30;

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
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text using Azure OCR
    const ocrText = await extractTextFromPDF(buffer);
    
    // Parse nutrition information
    const parsedData = parseNutritionText(ocrText);
    
    return NextResponse.json({
      success: true,
      ocrText,
      parsed: parsedData,
    });
  } catch (error) {
    console.error('OCR API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process document', details: String(error) },
      { status: 500 }
    );
  }
}
