'use client';

import { useState } from 'react';

// 영양소 한글명 매핑
const NUTRIENT_KOREAN_NAMES: Record<string, string> = {
  energy: '열량',
  protein: '단백질',
  fat_total: '지방',
  fat_saturated: '포화지방',
  fat_trans: '트랜스지방',
  carbohydrate: '탄수화물',
  sugar: '당류',
  sodium: '나트륨',
  cholesterol: '콜레스테롤',
  fiber: '식이섬유',
};

// 영양소별 식약처 기준 정보
const NUTRIENT_INFO: Record<string, { daily: string; description: string; evaluation: (dv: number) => { color: string; text: string; status: string } }> = {
  energy: {
    daily: '2,000kcal',
    description: '성인 1일 영양소 기준치. 신체 활동과 기초대사에 필요한 에너지원',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-green-700', text: '저열량', status: '체중 조절에 적합' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정 열량', status: '간식/보조식으로 적합' };
      if (dv < 25) return { color: 'text-amber-700', text: '중간 열량', status: '식사 대용 가능' };
      return { color: 'text-red-700', text: '고열량', status: '섭취량 주의 필요' };
    },
  },
  protein: {
    daily: '50g',
    description: '근육 생성, 면역력 강화, 효소·호르몬 합성에 필수',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-gray-600', text: '저함량', status: '단백질 부족' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정 함량', status: '보충 효과' };
      if (dv < 30) return { color: 'text-green-700', text: '고단백', status: '우수 단백질 공급원' };
      return { color: 'text-green-800', text: '매우 높음', status: '고단백 식품' };
    },
  },
  fat_total: {
    daily: '54g',
    description: '필수지방산 공급, 지용성 비타민 흡수, 세포막 구성',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-green-700', text: '저지방', status: '저지방 식품' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 지방 함량' };
      if (dv < 30) return { color: 'text-amber-700', text: '다소 높음', status: '섭취 주의' };
      return { color: 'text-red-700', text: '고지방', status: '과다 섭취 주의' };
    },
  },
  fat_saturated: {
    daily: '15g',
    description: '동물성 지방에 많음. 과다 섭취 시 LDL 콜레스테롤 증가',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-green-700', text: '매우 낮음', status: '건강에 유리' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      if (dv < 30) return { color: 'text-amber-700', text: '높음', status: '섭취 제한 권장' };
      return { color: 'text-red-700', text: '매우 높음', status: '심혈관 건강 주의' };
    },
  },
  fat_trans: {
    daily: '0g',
    description: 'WHO 권장: 가능한 섭취하지 않을 것. 심혈관 질환 위험',
    evaluation: (dv) => {
      if (dv === 0) return { color: 'text-green-700', text: '없음', status: '안전' };
      if (dv < 1) return { color: 'text-blue-700', text: '극미량', status: '허용 수준' };
      return { color: 'text-red-700', text: '함유', status: '섭취 주의' };
    },
  },
  carbohydrate: {
    daily: '324g',
    description: '주요 에너지원. 뇌와 신경계 활동에 필수적인 포도당 공급',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-gray-600', text: '저함량', status: '저탄수화물' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      if (dv < 30) return { color: 'text-amber-700', text: '높음', status: '탄수화물 풍부' };
      return { color: 'text-red-700', text: '매우 높음', status: '혈당 관리 주의' };
    },
  },
  sugar: {
    daily: '100g',
    description: '첨가당 포함. 과다 섭취 시 비만, 당뇨병 위험',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-green-700', text: '저당', status: '저당 식품' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      if (dv < 30) return { color: 'text-amber-700', text: '높음', status: '섭취 주의' };
      return { color: 'text-red-700', text: '고당', status: '과다 섭취 위험' };
    },
  },
  sodium: {
    daily: '2,000mg',
    description: '식약처/WHO 권장 2,000mg 이하. 고혈압 주의',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-green-700', text: '저나트륨', status: '저염 식품' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      if (dv < 30) return { color: 'text-amber-700', text: '높음', status: '나트륨 주의' };
      return { color: 'text-red-700', text: '고나트륨', status: '고혈압 위험' };
    },
  },
  cholesterol: {
    daily: '300mg',
    description: '1일 300mg 이하 권장. 심혈관 건강 관리',
    evaluation: (dv) => {
      if (dv < 10) return { color: 'text-green-700', text: '낮음', status: '안전 수준' };
      if (dv < 30) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      return { color: 'text-red-700', text: '높음', status: '섭취 제한 권장' };
    },
  },
  fiber: {
    daily: '25g',
    description: '장 건강, 혈당 조절, 포만감 증가. 충분섭취량',
    evaluation: (dv) => {
      if (dv < 5) return { color: 'text-gray-600', text: '부족', status: '식이섬유 부족' };
      if (dv < 15) return { color: 'text-blue-700', text: '적정', status: '적정 수준' };
      if (dv < 30) return { color: 'text-green-700', text: '풍부', status: '우수한 급원' };
      return { color: 'text-green-800', text: '매우 풍부', status: '고함량 식품' };
    },
  },
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 건강기능식품 정보 입력
  const [productName, setProductName] = useState<string>('');
  const [productForm, setProductForm] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 건강기능식품 정보 추가
      if (productName) formData.append('productName', productName);
      if (productForm) formData.append('productForm', productForm);

      const response = await fetch('/api/review', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Processing failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-bio-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bio-gradient rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-bio-900">Root Inside BioNutrition AI</h1>
                <p className="text-sm text-earth-600">영양 성분표 AI 분석 시스템</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-bio-900 mb-4">
            영양 성분표를 업로드하고<br />AI 분석 결과를 확인하세요
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Azure OCR과 Google Gemini AI를 활용한 전문적인 영양 성분 분석 및 검증 시스템
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-bio-100 overflow-hidden animate-fade-in">
            <form onSubmit={handleSubmit} className="p-8">
              
              {/* 건강기능식품 정보 입력 */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-bio-900 mb-2">
                    제품명 (선택사항)
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="예: 비타민C 1000, 오메가3 플러스, 프리미엄 홍삼"
                    className="w-full px-4 py-3 border-2 border-bio-200 rounded-lg focus:border-bio-500 focus:outline-none text-bio-900 placeholder-earth-400"
                  />
                  <p className="mt-1 text-xs text-earth-600">건강기능식품 제품명을 입력하면 더욱 정확한 분석이 가능합니다</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-bio-900 mb-3">
                    제형 선택 (선택사항)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'tablet', label: '정제', icon: '💊' },
                      { value: 'capsule', label: '캡슐', icon: '⚪' },
                      { value: 'powder', label: '분말', icon: '📦' },
                      { value: 'liquid', label: '액상', icon: '🧪' },
                      { value: 'jelly', label: '젤리/연질', icon: '🟡' },
                      { value: 'granule', label: '과립', icon: '⚫' },
                      { value: 'stick', label: '스틱', icon: '📏' },
                      { value: 'other', label: '기타', icon: '📋' },
                    ].map((form) => (
                      <button
                        key={form.value}
                        type="button"
                        onClick={() => setProductForm(productForm === form.value ? '' : form.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          productForm === form.value
                            ? 'border-bio-500 bg-bio-50 text-bio-900 font-semibold shadow-md'
                            : 'border-earth-200 bg-white text-earth-700 hover:border-bio-300 hover:bg-bio-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{form.icon}</div>
                        <div className="text-sm">{form.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-earth-600">제형을 선택하면 섭취 방법 등의 분석에 활용됩니다</p>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-bio-900 mb-3">
                  영양 성분표 파일 업로드
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-earth-700
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-bio-50 file:text-bio-700
                      hover:file:bg-bio-100
                      cursor-pointer border-2 border-dashed border-bio-300
                      rounded-lg p-4 hover:border-bio-500 transition-all"
                  />
                </div>
                {file && (
                  <p className="mt-2 text-sm text-bio-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {file.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bio-gradient text-white py-4 px-6 rounded-lg font-semibold
                  hover:shadow-lg transform hover:-translate-y-0.5 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>AI 분석 시작</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="px-8 pb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">오류가 발생했습니다</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      .env 파일에 Azure와 Gemini API 키가 올바르게 설정되어 있는지 확인해주세요.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-5xl mx-auto mt-8 animate-fade-in">
            
            {/* Product Info Card - 제품 정보 */}
            {(result.meta?.product || result.meta?.form) && (
              <div className="bg-gradient-to-r from-bio-50 to-earth-50 rounded-2xl shadow-lg border-2 border-bio-200 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-bio-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-bio-900">제품 정보</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.meta?.product && (
                    <div className="bg-white rounded-lg p-4 border border-bio-200">
                      <p className="text-xs text-earth-600 mb-1">제품명</p>
                      <p className="text-lg font-bold text-bio-900">{result.meta.product}</p>
                    </div>
                  )}
                  {result.meta?.form && (
                    <div className="bg-white rounded-lg p-4 border border-bio-200">
                      <p className="text-xs text-earth-600 mb-1">제형</p>
                      <p className="text-lg font-bold text-bio-900">
                        {(() => {
                          const forms: Record<string, string> = {
                            tablet: '💊 정제',
                            capsule: '⚪ 캡슐',
                            powder: '📦 분말',
                            liquid: '🧪 액상',
                            jelly: '🟡 젤리/연질',
                            granule: '⚫ 과립',
                            stick: '📏 스틱',
                            other: '📋 기타',
                          };
                          return forms[result.meta.form] || result.meta.form;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Summary Card */}
            {result.ai_summary && (
              <div className="bg-white rounded-2xl shadow-xl border border-bio-100 p-8 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bio-gradient rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-bio-900">AI 분석 결과</h3>
                    <p className="text-sm text-earth-600">Google Gemini 분석</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-bio-50 rounded-xl p-6 border border-bio-200">
                    <p className="text-lg text-bio-900 leading-relaxed">{result.ai_summary.summary}</p>
                  </div>

                  {result.ai_summary.highlights?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-bio-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        영양 장점
                      </h4>
                      <ul className="space-y-2">
                        {result.ai_summary.highlights.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-bio-700">
                            <span className="text-bio-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ai_summary.cautions?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        주의사항
                      </h4>
                      <ul className="space-y-2">
                        {result.ai_summary.cautions.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-amber-700">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nutritional Analysis - 영양학적 상세 분석 */}
            {result.ai_summary?.nutritional_analysis && (
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900">영양학적 상세 분석</h3>
                    <p className="text-sm text-purple-600">전문 영양학 기준 평가</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                    <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      열량 분석
                    </h4>
                    <p className="text-purple-900 leading-relaxed">{result.ai_summary.nutritional_analysis.energy_analysis}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                    <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      다량영양소 균형
                    </h4>
                    <p className="text-purple-900 leading-relaxed">{result.ai_summary.nutritional_analysis.macronutrient_balance}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                    <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      미량영양소 평가
                    </h4>
                    <p className="text-purple-900 leading-relaxed">{result.ai_summary.nutritional_analysis.micronutrient_evaluation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* KFDA Compliance - 식약처 규정 준수 */}
            {result.ai_summary?.kfda_compliance && (
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">식약처 규정 준수 평가</h3>
                    <p className="text-sm text-blue-600">KFDA 기준 검증</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">표시 기준 평가</h4>
                    <p className="text-blue-900 leading-relaxed">{result.ai_summary.kfda_compliance.labeling_status}</p>
                  </div>

                  {result.ai_summary.kfda_compliance.health_claims?.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                      <h4 className="text-sm font-bold text-blue-800 mb-3">건강기능성 표시 가능 항목</h4>
                      <ul className="space-y-2">
                        {result.ai_summary.kfda_compliance.health_claims.map((claim: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-blue-900">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{claim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ai_summary.kfda_compliance.warnings?.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                      <h4 className="text-sm font-bold text-amber-800 mb-3">필수 주의 문구</h4>
                      <ul className="space-y-2">
                        {result.ai_summary.kfda_compliance.warnings.map((warning: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-amber-900">
                            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Functional Food Analysis - 건강기능식품 분석 */}
            {result.ai_summary?.functional_food_analysis && (
              <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">건강기능식품 분석</h3>
                    <p className="text-sm text-green-600">기능성 평가 및 섭취 권장</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 제품 분류 - 강조 표시 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300 shadow-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide">제품 분류</h4>
                    </div>
                    <p className="text-xl font-bold text-green-900 leading-relaxed">
                      {result.ai_summary.functional_food_analysis.classification}
                    </p>
                  </div>

                  {result.ai_summary.functional_food_analysis.functionality?.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="text-sm font-bold text-green-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        식약처 인정 기능성
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {result.ai_summary.functional_food_analysis.functionality.map((func: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-green-200 hover:border-green-400 transition-colors">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-green-900 font-medium leading-relaxed">{func}</p>
                            </div>
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                    <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      섭취 권장사항
                    </h4>
                    <p className="text-green-900 leading-relaxed whitespace-pre-line">{result.ai_summary.functional_food_analysis.intake_recommendations}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Data Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-bio-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 earth-gradient rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-earth-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-bio-900">영양 성분 정보</h3>
                    <p className="text-sm text-earth-600">검증된 데이터</p>
                  </div>
                </div>
                <button
                  onClick={downloadJSON}
                  className="bg-earth-100 hover:bg-earth-200 text-earth-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>JSON 다운로드</span>
                </button>
              </div>

              {/* Serving Size */}
              {result.serving_size && (
                <div className="mb-6 bg-earth-50 rounded-xl p-4 border border-earth-200">
                  <h4 className="text-sm font-semibold text-earth-800 mb-2">1회 제공량</h4>
                  <p className="text-2xl font-bold text-bio-700">
                    {result.serving_size.value}{result.serving_size.unit}
                  </p>
                </div>
              )}

              {/* Nutrients Grid */}
              {result.nutrients && (
                <div className="space-y-4">
                  {Object.entries(result.nutrients).map(([key, data]: [string, any]) => {
                    const koreanName = NUTRIENT_KOREAN_NAMES[key] || key;
                    const info = NUTRIENT_INFO[key];
                    const dvValue = result.dv && result.dv[key] ? result.dv[key] : 0;
                    const evaluation = info?.evaluation(dvValue);

                    return (
                      <div key={key} className="border border-earth-200 rounded-xl p-5 hover:border-bio-400 hover:shadow-md transition-all bg-gradient-to-r from-white to-earth-50">
                        {/* 영양소 헤더 */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h5 className="text-lg font-bold text-bio-900">
                                {koreanName}
                              </h5>
                              {evaluation && (
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  evaluation.color === 'text-green-700' ? 'bg-green-100 text-green-700' :
                                  evaluation.color === 'text-blue-700' ? 'bg-blue-100 text-blue-700' :
                                  evaluation.color === 'text-amber-700' ? 'bg-amber-100 text-amber-700' :
                                  evaluation.color === 'text-red-700' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {evaluation.text}
                                </span>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-bio-700">
                              {data.value}{data.unit}
                            </p>
                          </div>
                          {result.dv && result.dv[key] && (
                            <div className="text-right bg-white rounded-lg px-4 py-2 border border-bio-200">
                              <div className="text-xs text-earth-600 mb-1">영양소기준치</div>
                              <div className="text-2xl font-bold text-bio-600">{result.dv[key]}%</div>
                            </div>
                          )}
                        </div>

                        {/* 식약처 기준 정보 */}
                        {info && (
                          <div className="mt-3 pt-3 border-t border-earth-200 space-y-2">
                            <div className="flex items-start space-x-2">
                              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-blue-800 mb-1">식약처 기준</p>
                                <p className="text-sm text-earth-700">
                                  <span className="font-semibold text-bio-800">1일 기준: {info.daily}</span> - {info.description}
                                </p>
                              </div>
                            </div>

                            {evaluation && (
                              <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-green-800 mb-1">영양학적 평가</p>
                                  <p className="text-sm font-medium text-earth-900">{evaluation.status}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-bio-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-earth-600">
            <p className="mb-2">
              <strong className="text-bio-700">Root Inside Co., Ltd.</strong> - BioNutrition AI System
            </p>
            <p className="text-xs">
              이 시스템은 참고용으로 제공됩니다. 최종 검증은 제조사의 책임입니다.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
