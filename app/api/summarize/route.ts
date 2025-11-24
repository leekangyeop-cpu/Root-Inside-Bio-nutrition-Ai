import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/llm';
import { AISummarySchema } from '@/lib/validate';
import { performPharmacistAnalysis } from '@/lib/pharmacist-analysis';

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
    
    // Perform pharmacist-level analysis
    const pharmacistAnalysis = performPharmacistAnalysis(body.nutrients);
    
    return NextResponse.json({
      success: true,
      summary: validated,
      pharmacist_analysis: pharmacistAnalysis,
    });
  } catch (error) {
    console.error('Summarize API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: String(error) },
      { status: 500 }
    );
  }
}
