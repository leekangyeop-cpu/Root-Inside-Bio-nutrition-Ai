import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, parseNutritionText } from '@/lib/ocr';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    console.log('📥 OCR API: Request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('📁 File info:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // 파일 타입 검증
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/bmp',
      'image/gif',
      'image/tiff',
      'application/pdf'
    ];
    
    if (!validTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { 
          error: 'Invalid file type. Please upload an image (JPG, PNG, BMP, GIF, TIFF) or PDF file.',
          receivedType: file.type 
        },
        { status: 400 }
      );
    }
    
    // 파일 크기 검증 (최대 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json(
        { 
          error: `File too large. Maximum size is 20MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    console.log('🔄 Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('✅ Buffer created:', buffer.length, 'bytes');
    
    // Extract text using Azure OCR
    console.log('🔍 Starting Azure OCR...');
    const ocrText = await extractTextFromPDF(buffer);
    console.log('✅ OCR completed. Extracted text length:', ocrText.length);
    
    if (!ocrText || ocrText.trim().length === 0) {
      console.warn('⚠️ No text extracted from image');
      return NextResponse.json(
        { 
          error: 'No text could be extracted from the image. Please ensure the image contains readable text and is not blurry.',
          ocrText: '',
          parsed: null,
        },
        { status: 400 }
      );
    }
    
    // Parse nutrition information
    console.log('📊 Parsing nutrition information...');
    const parsedData = parseNutritionText(ocrText);
    console.log('✅ Parsing completed. Found nutrients:', Object.keys(parsedData.nutrients || {}).length);
    
    return NextResponse.json({
      success: true,
      ocrText,
      parsed: parsedData,
      stats: {
        textLength: ocrText.length,
        nutrientsFound: Object.keys(parsedData.nutrients || {}).length,
      }
    });
  } catch (error: any) {
    console.error('❌ OCR API Error:', error);
    
    // 에러 메시지 정리
    let errorMessage = 'Failed to process document';
    let statusCode = 500;
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.message?.includes('authentication')) {
      statusCode = 401;
    } else if (error.message?.includes('rate limit')) {
      statusCode = 429;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: statusCode }
    );
  }
}
