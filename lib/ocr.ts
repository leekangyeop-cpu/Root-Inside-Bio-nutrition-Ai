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
    console.log('🔍 Starting OCR process...');
    console.log('📄 Buffer size:', buffer.length, 'bytes');
    
    if (!endpoint || !key) {
      throw new Error('Azure Vision credentials are not configured. Please check your .env file.');
    }
    
    // Use Read API for PDF/Image text extraction
    console.log('📤 Sending to Azure Vision API...');
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
    
    console.log('⏳ Waiting for OCR to complete... (Operation ID:', operationId, ')');
    
    // Poll for result (최대 30초 대기)
    let readResult;
    let attempts = 0;
    const maxAttempts = 30;
    
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      readResult = await client.getReadResult(operationId);
      attempts++;
      
      if (attempts % 5 === 0) {
        console.log(`⏳ Still processing... (${attempts}s elapsed, status: ${readResult.status})`);
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('OCR timeout: Processing took too long');
      }
    } while (readResult.status === 'running' || readResult.status === 'notStarted');
    
    if (readResult.status !== 'succeeded') {
      throw new Error(`OCR failed with status: ${readResult.status}`);
    }
    
    console.log('✅ OCR completed successfully!');
    
    // Extract all text
    const pages = readResult.analyzeResult?.readResults || [];
    
    if (pages.length === 0) {
      console.warn('⚠️ No pages found in OCR result');
      return '';
    }
    
    console.log(`📄 Found ${pages.length} page(s)`);
    
    const allText = pages
      .map((page, idx) => {
        const pageText = page.lines?.map(line => line.text).join('\n') || '';
        console.log(`📄 Page ${idx + 1}: ${page.lines?.length || 0} lines, ${pageText.length} characters`);
        return pageText;
      })
      .join('\n\n');
    
    console.log(`✅ Total extracted text: ${allText.length} characters`);
    
    if (allText.length === 0) {
      throw new Error('No text was extracted from the image. Please ensure the image contains readable text.');
    }
    
    return allText;
  } catch (error: any) {
    console.error('❌ OCR Error:', error);
    
    // 더 자세한 에러 메시지
    if (error.statusCode === 401) {
      throw new Error('Azure Vision API authentication failed. Please check your API key.');
    } else if (error.statusCode === 429) {
      throw new Error('Azure Vision API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Azure Vision API. Please check your endpoint URL.');
    } else if (error.message) {
      throw new Error(`OCR failed: ${error.message}`);
    } else {
      throw new Error('Failed to extract text from document');
    }
  }
}

/**
 * Parse OCR text to extract nutrition information
 * Enhanced parser supporting vitamins, minerals, and functional ingredients
 */
export function parseNutritionText(text: string): any {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const data: any = {
    meta: {},
    nutrients: {},
  };
  
  // Extract serving size (더 다양한 패턴 지원)
  const servingPatterns = [
    /(\d+\.?\d*)\s*(g|mg|kg|그램|밀리그램)/i,
    /(\d+\.?\d*)\s*(ml|mL|밀리리터)/i,
    /(\d+\.?\d*)\s*(ea|정|캡슐|포|tablet|capsule)/i,
    /1회\s*제공량[\s:]*(\d+\.?\d*)\s*(g|ml|ea|정|캡슐)/i,
  ];
  
  for (const pattern of servingPatterns) {
    const servingMatch = text.match(pattern);
    if (servingMatch) {
      const unit = servingMatch[2].toLowerCase();
      data.serving_size = {
        value: parseFloat(servingMatch[1]),
        unit: unit.includes('g') || unit.includes('그램') ? 'g' :
              unit.includes('ml') || unit.includes('밀리') ? 'ml' : 'ea',
      };
      break;
    }
  }
  
  // 확장된 영양소 및 기능성 원료 패턴
  const nutrientPatterns = [
    // 기본 영양성분
    { key: 'energy', pattern: /(열량|에너지|칼로리|calories?|energy)[\s:]*(-?\d+[,.]?\d*)\s*(kcal|cal)/i },
    { key: 'protein', pattern: /(단백질|protein)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'fat_total', pattern: /(지방|total[\s-]?fat|fat)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'fat_saturated', pattern: /(포화[\s-]?지방|saturated[\s-]?fat)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'fat_trans', pattern: /(트랜스[\s-]?지방|trans[\s-]?fat)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'carbohydrate', pattern: /(탄수화물|carbohydrate|carbs?)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'sugar', pattern: /(당류|sugars?)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'sodium', pattern: /(나트륨|sodium)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'cholesterol', pattern: /(콜레스테롤|cholesterol)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'fiber', pattern: /(식이[\s-]?섬유|dietary[\s-]?fiber|fiber)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    
    // 비타민류 (모든 표기법 지원)
    { key: 'vitamin_a', pattern: /(비타민[\s-]?A|vitamin[\s-]?A|레티놀|retinol)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg|IU|RE|μg[\s]?RE)/i },
    { key: 'vitamin_b1', pattern: /(비타민[\s-]?B1|vitamin[\s-]?B1|티아민|thiamine?)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'vitamin_b2', pattern: /(비타민[\s-]?B2|vitamin[\s-]?B2|리보플라빈|riboflavin)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'vitamin_b3', pattern: /(비타민[\s-]?B3|vitamin[\s-]?B3|나이아신|niacin)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg|mg[\s]?NE)/i },
    { key: 'vitamin_b5', pattern: /(비타민[\s-]?B5|vitamin[\s-]?B5|판토텐산|pantothenic[\s-]?acid)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'vitamin_b6', pattern: /(비타민[\s-]?B6|vitamin[\s-]?B6|피리독신|pyridoxine)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'vitamin_b7', pattern: /(비타민[\s-]?B7|vitamin[\s-]?B7|비오틴|biotin)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'vitamin_b9', pattern: /(비타민[\s-]?B9|vitamin[\s-]?B9|엽산|folic[\s-]?acid|folate)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg|μg[\s]?DFE)/i },
    { key: 'vitamin_b12', pattern: /(비타민[\s-]?B12|vitamin[\s-]?B12|코발라민|cobalamin)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'vitamin_c', pattern: /(비타민[\s-]?C|vitamin[\s-]?C|아스코르브산|ascorbic[\s-]?acid)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'vitamin_d', pattern: /(비타민[\s-]?D|vitamin[\s-]?D|콜레칼시페롤|cholecalciferol)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg|IU)/i },
    { key: 'vitamin_e', pattern: /(비타민[\s-]?E|vitamin[\s-]?E|토코페롤|tocopherol)[\s:]*(-?\d+[,.]?\d*)\s*(mg|IU|mg[\s]?α-TE)/i },
    { key: 'vitamin_k', pattern: /(비타민[\s-]?K|vitamin[\s-]?K|필로퀴논|phylloquinone)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    
    // 미네랄류
    { key: 'calcium', pattern: /(칼슘|calcium|Ca)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'magnesium', pattern: /(마그네슘|magnesium|Mg)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'zinc', pattern: /(아연|zinc|Zn)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'iron', pattern: /(철분?|iron|Fe)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'phosphorus', pattern: /(인|phosphorus|P)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'iodine', pattern: /(요오드|아이오딘|iodine|I)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'selenium', pattern: /(셀레늄|selenium|Se)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'copper', pattern: /(구리|copper|Cu)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'manganese', pattern: /(망간|manganese|Mn)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'chromium', pattern: /(크롬|chromium|Cr)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'molybdenum', pattern: /(몰리브덴|molybdenum|Mo)[\s:]*(-?\d+[,.]?\d*)\s*(μg|ug|mcg|mg)/i },
    { key: 'potassium', pattern: /(칼륨|potassium|K)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    
    // 기능성 원료
    { key: 'omega3', pattern: /(오메가[\s-]?3|omega[\s-]?3|DHA|EPA)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'probiotics', pattern: /(프로바이오틱스?|유산균|probiotics?|lactobacillus)[\s:]*(-?\d+[,.]?\d*)\s*(cfu|억|mg)/i },
    { key: 'coq10', pattern: /(코엔자임[\s-]?Q10|coenzyme[\s-]?Q10|CoQ10|ubiquinone)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'lutein', pattern: /(루테인|lutein)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
    { key: 'collagen', pattern: /(콜라겐|collagen)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'glucosamine', pattern: /(글루코사민|glucosamine)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    
    // 추가 건강기능식품 성분
    { key: 'albumin', pattern: /(알부민|albumin)[\s:]*(-?\d+[,.]?\d*)\s*(g|mg)/i },
    { key: 'ginseng', pattern: /(홍삼|인삼|ginseng|ginsenoside)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'milk_thistle', pattern: /(밀크[\s-]?씨슬|엉겅퀴|milk[\s-]?thistle|silymarin)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'chondroitin', pattern: /(콘드로이틴|chondroitin)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'msm', pattern: /(MSM|methylsulfonylmethane)[\s:]*(-?\d+[,.]?\d*)\s*(mg|g)/i },
    { key: 'hyaluronic_acid', pattern: /(히알루론산|hyaluronic[\s-]?acid)[\s:]*(-?\d+[,.]?\d*)\s*(mg|μg)/i },
  ];
  
  // 각 라인을 순회하며 영양소 추출
  for (const line of lines) {
    for (const { key, pattern } of nutrientPatterns) {
      const match = line.match(pattern);
      if (match && !data.nutrients[key]) {
        // 숫자에서 쉼표 제거 및 파싱
        const valueStr = match[2].replace(',', '.');
        let value = parseFloat(valueStr);
        
        // 단위 정규화
        let unit = match[3].toLowerCase();
        unit = unit.replace(/\s+/g, ''); // 공백 제거
        
        // μg, ug, mcg 통일
        if (unit === 'ug' || unit === 'mcg') {
          unit = 'μg';
        }
        
        data.nutrients[key] = {
          value: value,
          unit: unit,
        };
      }
    }
  }
  
  // 퍼센트(%NRV) 추출
  const percentPattern = /(\d{1,3})\s*%/;
  for (const line of lines) {
    for (const key of Object.keys(data.nutrients)) {
      if (line.toLowerCase().includes(key.replace('_', ' ')) || 
          line.includes(data.nutrients[key].toString())) {
        const percentMatch = line.match(percentPattern);
        if (percentMatch) {
          data.nutrients[key].percent_dv = parseInt(percentMatch[1]);
        }
      }
    }
  }
  
  return data;
}
