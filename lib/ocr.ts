import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const endpoint = process.env.AZURE_VISION_ENDPOINT || '';
const key = process.env.AZURE_VISION_KEY || '';

if (!endpoint || !key) {
  console.warn('Azure Vision credentials not configured');
}

const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new ComputerVisionClient(credentials, endpoint);

/**
 * Extract text from PDF/Image buffer using Azure Computer Vision
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Use Read API for PDF/Image text extraction
    const result = await client.readInStream(buffer);
    
    // Get operation location
    const operationLocation = result.operationLocation;
    if (!operationLocation) {
      throw new Error('No operation location returned from Azure');
    }
    
    const operationId = operationLocation.split('/').pop();
    if (!operationId) {
      throw new Error('Could not extract operation ID');
    }
    
    // Poll for result
    let readResult;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      readResult = await client.getReadResult(operationId);
    } while (readResult.status === 'running' || readResult.status === 'notStarted');
    
    if (readResult.status !== 'succeeded') {
      throw new Error(`OCR failed with status: ${readResult.status}`);
    }
    
    // Extract all text
    const pages = readResult.analyzeResult?.readResults || [];
    const allText = pages
      .map(page => page.lines?.map(line => line.text).join('\n'))
      .join('\n\n');
    
    return allText;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from document');
  }
}

/**
 * Parse OCR text to extract nutrition information
 * This is a simple regex-based parser - can be enhanced with ML
 */
export function parseNutritionText(text: string): any {
  const lines = text.split('\n').map(line => line.trim());
  
  const data: any = {
    meta: {},
    nutrients: {},
  };
  
  // Extract serving size
  const servingMatch = text.match(/(\d+\.?\d*)\s*(g|ml|ea|그램|밀리리터)/i);
  if (servingMatch) {
    data.serving_size = {
      value: parseFloat(servingMatch[1]),
      unit: servingMatch[2].toLowerCase().startsWith('g') ? 'g' : 
            servingMatch[2].toLowerCase().startsWith('ml') ? 'ml' : 'ea',
    };
  }
  
  // Extract nutrients using patterns
  const nutrientPatterns = [
    { key: 'energy', pattern: /(열량|에너지|calories?|energy)[\s:]*(\d+\.?\d*)\s*(kcal)/i },
    { key: 'protein', pattern: /(단백질|protein)[\s:]*(\d+\.?\d*)\s*(g|mg)/i },
    { key: 'fat_total', pattern: /(지방|total\s*fat|fat)[\s:]*(\d+\.?\d*)\s*(g|mg)/i },
    { key: 'carbohydrate', pattern: /(탄수화물|carbohydrate)[\s:]*(\d+\.?\d*)\s*(g|mg)/i },
    { key: 'sodium', pattern: /(나트륨|sodium)[\s:]*(\d+\.?\d*)\s*(mg|g)/i },
    { key: 'sugar', pattern: /(당류|sugars?)[\s:]*(\d+\.?\d*)\s*(g|mg)/i },
  ];
  
  for (const { key, pattern } of nutrientPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.nutrients[key] = {
        value: parseFloat(match[2]),
        unit: match[3].toLowerCase(),
      };
    }
  }
  
  return data;
}
