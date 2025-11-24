import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/llm';
import { AISummarySchema } from '@/lib/validate';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.nutrients || !body.serving_size) {
      return NextResponse.json(
        { error: 'Missing required nutrition data' },
        { status: 400 }
      );
    }
    
    // Generate AI summary
    const summary = await generateSummary(body);
    
    // Validate summary structure
    const validated = AISummarySchema.parse(summary);
    
    return NextResponse.json({
      success: true,
      summary: validated,
    });
  } catch (error) {
    console.error('Summarize API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: String(error) },
      { status: 500 }
    );
  }
}
